import zlib from "zlib";
import { JWS, JWK } from "node-jose";
import axios from "axios";

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
export async function numericShcToJwt(rawData: string) {
  // Split into groups of 2 numeric characters each of which represent a single JWS char
  const codes = rawData.match(/(..?)/g) || [];

  const jwt = codes
    .map((c) => parseInt(c, 10))
    .map((c) => String.fromCharCode(c + SMALLEST_B64_CHAR_CODE))
    .join("");

  // decode jwt
  const [headerBuf, compressedPayloadBuf] = jwt
    // There are two base64 strings (header and payload) separated by a "."
    .split(".")
    .map((base64) => Buffer.from(base64, "base64"));

  const header = JSON.parse(headerBuf.toString());
  const payload = JSON.parse(
    zlib.inflateRawSync(compressedPayloadBuf).toString()
  );
  const verifications = await verifySignature(jwt, payload.iss);

  return { header, payload, verifications };
}

export default async function decode(rawText: string) {
  const uri = new URL(rawText);
  if (uri.protocol !== "shc:") {
    throw new InvalidProtocol(uri.protocol);
  }
  const rawData = uri.pathname.substring(1);
  await numericShcToJwt(rawData);
  return true;
}
