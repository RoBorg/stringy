import { describe, it, expect } from 'vitest';
import JwtDecode from '../JwtDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTAwMDAwMDAwMH0.sig';
const futureJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsIm5iZiI6NDEwMjQ0NDgwMH0.sig';
const noAlgHeaderJwt = 'e30.eyJhIjoxfQ.sig';

describe('JwtDecode', () => {
  describe('canParse', () => {
    it('accepts a well-formed JWT with an alg header', () => {
      expect(JwtDecode.canParse(validJwt)).toBe(true);
    });

    it('rejects a token whose header lacks an alg claim', () => {
      expect(JwtDecode.canParse(noAlgHeaderJwt)).toBe(false);
    });

    it('rejects strings that are not three dot-separated segments', () => {
      expect(JwtDecode.canParse('not.a.jwt.at.all')).toBe(false);
      expect(JwtDecode.canParse('plain text')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes the header and payload', () => {
      const wrapper = mountAction(JwtDecode, { inputString: validJwt });

      expect(wrapper.vm.header).toEqual({ alg: 'HS256', typ: 'JWT' });
      expect(wrapper.vm.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
      expect(wrapper.vm.error).toBe('');
    });

    it('decodes the signature to hex', () => {
      const wrapper = mountAction(JwtDecode, { inputString: validJwt });

      expect(wrapper.vm.signatureHex).toMatch(/^[0-9a-f]+$/);
      expect(wrapper.vm.signatureHex.length).toBe(64);
    });

    it('flags a token with a past exp claim as expired', () => {
      const wrapper = mountAction(JwtDecode, { inputString: expiredJwt });

      expect(wrapper.vm.isExpired).toBe(true);
      expect(wrapper.vm.isNotYetValid).toBe(false);
    });

    it('flags a token with a future nbf claim as not yet valid', () => {
      const wrapper = mountAction(JwtDecode, { inputString: futureJwt });

      expect(wrapper.vm.isNotYetValid).toBe(true);
      expect(wrapper.vm.isExpired).toBe(false);
    });

    it('sets an error for a malformed token', () => {
      const wrapper = mountAction(JwtDecode, { inputString: 'not.a.jwt.at.all' });

      expect(wrapper.vm.error).toContain('Not a valid JWT');
    });

    it('sets an error when a segment is not valid base64url JSON', () => {
      const wrapper = mountAction(JwtDecode, { inputString: 'not-base64.not-base64.sig' });

      expect(wrapper.vm.error).toContain('Unable to decode token');
    });
  });
});
