class InvalidProtocol extends Error {
  constructor(protocol: string) {
    super(`Expected shc protocol but received ${protocol}`);
  }
}

export default function decode(rawText: string) {
  const uri = new URL(rawText);
  if (uri.protocol !== "shc:") {
    throw new InvalidProtocol(uri.protocol);
  }
  return true;
}
