import { describe, it, expect } from 'vitest';
import DataUriDecode from '../DataUriDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('DataUriDecode', () => {
  describe('canParse', () => {
    it('accepts data URIs', () => {
      expect(DataUriDecode.canParse('data:text/plain;base64,aGVsbG8=')).toBe(true);
    });

    it('rejects other strings', () => {
      expect(DataUriDecode.canParse('hello world')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes base64 data URIs', () => {
      const wrapper = mountAction(DataUriDecode, { inputString: 'data:text/plain;base64,aGVsbG8=' });

      expect(new TextDecoder().decode(wrapper.vm.intArray)).toBe('hello');
      expect(wrapper.vm.error).toBe('');
    });

    it('decodes URL-encoded data URIs', () => {
      const wrapper = mountAction(DataUriDecode, { inputString: 'data:text/plain,hello%20world' });

      expect(new TextDecoder().decode(wrapper.vm.intArray)).toBe('hello world');
    });

    it('sets an error for malformed data URIs', () => {
      const wrapper = mountAction(DataUriDecode, { inputString: 'not a data uri' });

      expect(wrapper.vm.error).toBe('Invalid data URI');
    });
  });
});
