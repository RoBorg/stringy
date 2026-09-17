import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import SslCertificateDecode from '../SslCertificateDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

const testDir = dirname(fileURLToPath(import.meta.url));

function fixture (name) {
  return readFileSync(join(testDir, '../../../../test/fixtures', name), 'utf8');
}

const certificatePem = fixture('certificate.pem');
const csrPem = fixture('csr.pem');

// Decoding runs through several chained awaits (ASN.1 parsing, two
// crypto.subtle.digest() calls, signature verification), so wait for the
// items array to actually be populated rather than a fixed number of ticks.
async function decodedItems (wrapper) {
  await vi.waitFor(() => {
    if (wrapper.vm.items.length === 0) {
      throw new Error('not decoded yet');
    }
  });

  return wrapper.vm.items;
}

describe('SslCertificateDecode', () => {
  describe('canParse', () => {
    it('accepts a PEM certificate block', () => {
      expect(SslCertificateDecode.canParse(certificatePem)).toBe(true);
    });

    it('accepts a PEM CSR block', () => {
      expect(SslCertificateDecode.canParse(csrPem)).toBe(true);
    });

    it('rejects text with no PEM blocks', () => {
      expect(SslCertificateDecode.canParse('just some text')).toBe(false);
    });
  });

  describe('certificate output', () => {
    it('decodes subject, issuer and validity', async () => {
      const wrapper = mountAction(SslCertificateDecode, { inputString: certificatePem });
      const [item] = await decodedItems(wrapper);

      expect(item.label).toBe('CERTIFICATE');
      expect(item.error).toBeUndefined();
      expect(item.data.type).toBe('certificate');
      expect(item.data.subjectString).toBe('C=GB, O=Stringy Test, CN=stringy.test');
      expect(item.data.issuerString).toBe('C=GB, O=Stringy Test, CN=stringy.test');
      expect(item.data.selfSigned).toBe(true);
      expect(item.data.signatureValid).toBe(true);
      expect(item.data.serialNumber).toBe('4c:85:d0:66:79:23:64:bb:71:97:05:ed:1f:bb:95:ad:1d:c1:02:64');
      expect(item.data.version).toBe(3);
      expect(item.data.isExpired).toBe(false);
      expect(item.data.isNotYetValid).toBe(false);
      expect(item.data.signatureAlgorithm).toBe('sha256WithRSAEncryption');
      expect(item.data.publicKeyAlgorithm).toBe('RSA');
      expect(item.data.publicKeySize).toBe(2048);
    });

    it('parses the subjectAltName extension', async () => {
      const wrapper = mountAction(SslCertificateDecode, { inputString: certificatePem });
      const [item] = await decodedItems(wrapper);

      expect(item.data.extensions.subjectAltName).toEqual([
        { type: 'DNS', value: 'stringy.test' },
        { type: 'DNS', value: '*.stringy.test' }
      ]);
    });

    it('computes SHA-1 and SHA-256 fingerprints', async () => {
      const wrapper = mountAction(SslCertificateDecode, { inputString: certificatePem });
      const [item] = await decodedItems(wrapper);

      expect(item.data.sha1Fingerprint).toMatch(/^([0-9a-f]{2}:){19}[0-9a-f]{2}$/);
      expect(item.data.sha256Fingerprint).toMatch(/^([0-9a-f]{2}:){31}[0-9a-f]{2}$/);
    });
  });

  describe('CSR output', () => {
    it('decodes the subject and public key', async () => {
      const wrapper = mountAction(SslCertificateDecode, { inputString: csrPem });
      const [item] = await decodedItems(wrapper);

      expect(item.label).toBe('CERTIFICATE REQUEST');
      expect(item.data.type).toBe('csr');
      expect(item.data.subjectString).toBe('C=GB, O=Stringy Test, CN=csr.stringy.test');
      expect(item.data.signatureValid).toBe(true);
      expect(item.data.publicKeyAlgorithm).toBe('RSA');
      expect(item.data.publicKeySize).toBe(2048);
    });
  });

  describe('invalid input', () => {
    it('produces no items for non-PEM text', async () => {
      const wrapper = mountAction(SslCertificateDecode, { inputString: 'just some text' });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.vm.items).toEqual([]);
    });

    it('reports an error for an unparseable PEM block', async () => {
      const corrupt = '-----BEGIN CERTIFICATE-----\nbm90IGEgY2VydA==\n-----END CERTIFICATE-----';
      const wrapper = mountAction(SslCertificateDecode, { inputString: corrupt });
      const [item] = await decodedItems(wrapper);

      expect(item.error).toBeTruthy();
    });
  });
});
