import pako from "pako";
import { JWS } from "node-jose";

import getKeys from "./keys";

class InvalidProtocol extends Error {
  constructor(protocol: string) {
    super(`Expected shc protocol but received ${protocol}`);
  }
}

// https://github.com/smart-on-fhir/health-cards/blob/main/generate-examples/src/index.ts#L178
const SMALLEST_B64_CHAR_CODE = 45; // "-".charCodeAt(0) === 45

async function verifySignature(jwt: string, issuer: string) {
  try {
    const keys = await getKeys(issuer);
    const result = await JWS.createVerify(keys).verify(jwt);

    return {
      trustable: true,
      verifiedBy: result.key.kid,
      origin: issuer,
    };
  } catch (err) {
    return {
      verificationError: err,
      trustable: false,
    };
  }
}

/**
 * Convert a SHC raw string to a standard JWT
 * @param rawSHC The raw 'shc://' string (from a QR code)
 */
export function numericShcToJwt(rawData: string) {
  // Split into groups of 2 numeric characters each of which represent a single JWS char
  const codes = rawData.match(/(..?)/g) || [];

  return codes
    .map((c) => parseInt(c, 10))
    .map((c) => String.fromCharCode(c + SMALLEST_B64_CHAR_CODE))
    .join("");
}

export default async function decode(rawText: string) {
  const matches = rawText.match(/(.*):\/(.*)/) || [false, false, false];
  const protocol = (matches[1] || "") as string;
  const rawData = (matches[2] || "") as string;
  if (protocol !== "shc") {
    throw new InvalidProtocol(protocol);
  }
  const jwt = numericShcToJwt(rawData);
  // decode jwt
  const [headerBuf, compressedPayloadBuf] = jwt
    // There are two base64 strings (header and payload) separated by a "."
    .split(".")
    .map((base64) => Buffer.from(base64, "base64"));

  const header = JSON.parse(headerBuf.toString());
  const payload = JSON.parse(
    pako.inflateRaw(compressedPayloadBuf, { to: "string" })
  );
  const verifications = await verifySignature(jwt, payload.iss);

  // console.dir({ header, payload, verifications }, { depth: null });
  return { header, payload, verifications };
}
