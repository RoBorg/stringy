import { createHash, webcrypto } from 'node:crypto';

// jsdom's global TextEncoder produces Uint8Arrays from Node's outer realm,
// not jsdom's own realm, so `instanceof Uint8Array` (and Vue's prop type
// checks) fail even though the values look identical. Re-cast encode()'s
// output through the ambient (jsdom-realm) Uint8Array to fix that up.
const NativeTextEncoder = globalThis.TextEncoder;

globalThis.TextEncoder = class extends NativeTextEncoder {
  encode (input) {
    return Uint8Array.from(super.encode(input));
  }
};

// jsdom doesn't implement SubtleCrypto - SslCertificateDecode relies on
// crypto.subtle.digest() to compute certificate fingerprints. Node's
// WebCrypto SubtleCrypto rejects ArrayBuffers from jsdom's separate realm
// (a strict WebIDL brand check), so bridge digest() through the classic
// Hash API instead, which doesn't care which realm a buffer came from.
if (!globalThis.crypto?.subtle) {
  globalThis.crypto = webcrypto;
}

const nodeHashNames = { 'SHA-1': 'sha1', 'SHA-256': 'sha256', 'SHA-384': 'sha384', 'SHA-512': 'sha512' };

globalThis.crypto.subtle.digest = async (algorithm, data) => {
  const bytes = ArrayBuffer.isView(data)
    ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
    : Buffer.from(data);

  return createHash(nodeHashNames[algorithm] || algorithm).update(bytes).digest().buffer;
};

// Actions that hit external services (IpAddress, Url) must not make real
// network calls during tests. Fail loudly if a test forgets to mock fetch.
globalThis.fetch = () => Promise.reject(new Error('Unexpected network call - mock fetch in the test'));
