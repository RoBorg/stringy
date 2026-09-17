import { describe, it, expect } from 'vitest';
import HexDecode from '../HexDecode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('HexDecode', () => {
  describe('canParse', () => {
    it('accepts hex strings', () => {
      expect(HexDecode.canParse('68656c6c6f')).toBe(true);
    });

    it('rejects non-hex strings', () => {
      expect(HexDecode.canParse('hello world')).toBe(false);
    });
  });

  describe('output', () => {
    it('decodes hex to the original bytes', () => {
      const wrapper = mountAction(HexDecode, { inputString: '68656c6c6f' });

      expect(Array.from(wrapper.vm.intArray)).toEqual(Array.from(new TextEncoder().encode('hello')));
      expect(wrapper.vm.error).toBe('');
    });

    it('ignores whitespace between byte pairs', () => {
      const wrapper = mountAction(HexDecode, { inputString: '68 65 6c 6c 6f' });

      expect(Array.from(wrapper.vm.intArray)).toEqual(Array.from(new TextEncoder().encode('hello')));
    });

    it('sets an error for invalid hex', () => {
      const wrapper = mountAction(HexDecode, { inputString: 'zz' });

      expect(wrapper.vm.error).toBe('Invalid hex data');
    });
  });
});
