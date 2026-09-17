import { describe, it, expect } from 'vitest';
import HtmlDecode from '../HtmlDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('HtmlDecode', () => {
  describe('canParse', () => {
    it('accepts strings with HTML entities', () => {
      expect(HtmlDecode.canParse('Tom &amp; Jerry')).toBe(true);
    });

    it('rejects strings without entities', () => {
      expect(HtmlDecode.canParse('Tom & Jerry')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes named and numeric entities', () => {
      const wrapper = mountAction(HtmlDecode, { inputString: 'Tom &amp; Jerry &#8482;' });

      expect(new TextDecoder().decode(wrapper.vm.intArray)).toBe('Tom & Jerry ™');
      expect(wrapper.vm.error).toBe('');
    });
  });
});
