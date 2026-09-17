import { describe, it, expect } from 'vitest';
import UrlDecode from '../UrlDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('UrlDecode', () => {
  describe('canParse', () => {
    it('accepts percent-encoded strings', () => {
      expect(UrlDecode.canParse('hello%20world')).toBe(true);
    });

    it('rejects strings without a %', () => {
      expect(UrlDecode.canParse('hello world')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes percent-encoded bytes', () => {
      const wrapper = mountAction(UrlDecode, { inputString: 'hello%20world' });

      expect(Array.from(wrapper.vm.intArray)).toEqual(Array.from(new TextEncoder().encode('hello world')));
      expect(wrapper.vm.error).toBe('');
    });
  });
});
