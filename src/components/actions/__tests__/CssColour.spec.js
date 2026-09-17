import { describe, it, expect } from 'vitest';
import CssColour from '../CssColour.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('CssColour', () => {
  describe('canParse', () => {
    it('accepts hex, rgb() and hsl() colours', () => {
      expect(CssColour.canParse('#ff0000')).toBe(true);
      expect(CssColour.canParse('rgb(255, 0, 0)')).toBe(true);
      expect(CssColour.canParse('hsl(0, 100%, 50%)')).toBe(true);
    });

    it('rejects named colours and other invalid input (pure-color does not parse them)', () => {
      expect(CssColour.canParse('red')).toBe(false);
      expect(CssColour.canParse('not a colour')).toBe(false);
    });
  });

  describe('output', () => {
    it('converts a hex colour to rgb and hsl', () => {
      const wrapper = mountAction(CssColour, { inputString: '#ff0000' });

      expect(wrapper.vm.asHex).toBe('#ff0000');
      expect(wrapper.vm.asRgb).toBe('rgb(255, 0, 0)');
      expect(wrapper.vm.asHsl).toBe('hsl(0, 100%, 50%)');
    });

    it('converts an rgb() colour to hex', () => {
      const wrapper = mountAction(CssColour, { inputString: 'rgb(0, 255, 0)' });

      expect(wrapper.vm.asHex).toBe('#00ff00');
    });

    // Note: `error` is derived from the fallback `colour` (which is always a
    // valid hex), not from the raw input, so it never actually becomes true -
    // invalid input just falls back to displaying black (#000000).
    it('falls back to black for invalid input', () => {
      const wrapper = mountAction(CssColour, { inputString: 'not a colour' });

      expect(wrapper.vm.asHex).toBe('#000000');
    });
  });
});
