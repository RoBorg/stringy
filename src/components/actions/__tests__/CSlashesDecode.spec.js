import { describe, it, expect } from 'vitest';
import CSlashesDecode from '../CSlashesDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

function decodedText (wrapper) {
  return new TextDecoder().decode(wrapper.vm.intArray);
}

describe('CSlashesDecode', () => {
  describe('canParse', () => {
    it('accepts strings with C-style escapes', () => {
      expect(CSlashesDecode.canParse('line1\\nline2')).toBe(true);
    });

    it('rejects strings without escapes', () => {
      expect(CSlashesDecode.canParse('plain text')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes named escapes', () => {
      const wrapper = mountAction(CSlashesDecode, { inputString: 'a\\tb\\nc' });

      expect(decodedText(wrapper)).toBe('a\tb\nc');
    });

    it('decodes octal escapes', () => {
      const wrapper = mountAction(CSlashesDecode, { inputString: '\\101\\102' });

      expect(decodedText(wrapper)).toBe('AB');
    });

    it('decodes hex escapes', () => {
      const wrapper = mountAction(CSlashesDecode, { inputString: '\\x41\\x42' });

      expect(decodedText(wrapper)).toBe('AB');
    });

    it('decodes unicode escapes', () => {
      const wrapper = mountAction(CSlashesDecode, { inputString: '\\u0041' });

      expect(decodedText(wrapper)).toBe('A');
    });

    it('decodes escaped backslashes without corrupting them', () => {
      const wrapper = mountAction(CSlashesDecode, { inputString: 'a\\\\nb' });

      expect(decodedText(wrapper)).toBe('a\\nb');
    });
  });
});
