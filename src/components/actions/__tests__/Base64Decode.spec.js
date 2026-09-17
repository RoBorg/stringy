import { describe, it, expect } from 'vitest';
import Base64Decode from '../Base64Decode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('Base64Decode', () => {
  describe('canParse', () => {
    it('accepts valid base64', () => {
      expect(Base64Decode.canParse('aGVsbG8=')).toBe(true);
    });

    it('rejects strings with invalid characters', () => {
      expect(Base64Decode.canParse('not base64!!')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes valid base64 to the original bytes', () => {
      const wrapper = mountAction(Base64Decode, { inputString: 'aGVsbG8=' });

      expect(Array.from(wrapper.vm.intArray)).toEqual(Array.from(new TextEncoder().encode('hello')));
      expect(wrapper.vm.error).toBe('');
    });

    it('sets an error for invalid base64', () => {
      const wrapper = mountAction(Base64Decode, { inputString: 'not base64!!' });

      expect(wrapper.vm.error).toBe('Invalid Base64 data');
    });
  });
});
