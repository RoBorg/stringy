import { createHash, webcrypto } from 'node:crypto';

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
