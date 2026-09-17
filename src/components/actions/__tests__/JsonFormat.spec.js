import { describe, it, expect } from 'vitest';
import JsonFormat from '../JsonFormat.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('JsonFormat', () => {
  describe('canParse', () => {
    it('accepts valid JSON objects and arrays', () => {
      expect(JsonFormat.canParse('{"a":1}')).toBe(true);
      expect(JsonFormat.canParse('[1,2,3]')).toBe(true);
    });

    it('rejects raw scalar values', () => {
      expect(JsonFormat.canParse('123456')).toBe(false);
    });

    it('rejects invalid JSON', () => {
      expect(JsonFormat.canParse('{a:1}')).toBe(false);
    });
  });

  describe('output', () => {
    it('formats JSON with the default indent', () => {
      const wrapper = mountAction(JsonFormat, { inputString: '{"a":1,"b":[1,2]}' });

      expect(wrapper.vm.outputString).toBe(JSON.stringify({ a: 1, b: [1, 2] }, null, 4));
      expect(wrapper.vm.error).toBe('');
    });

    it('formats with tabs when selected', async () => {
      // outputString is only recomputed when the input text changes, so
      // changing indentType alone has no effect until the text changes too.
      const wrapper = mountAction(JsonFormat, { inputString: '{"a":1}' });

      await wrapper.setData({ indentType: 'tabs' });
      await wrapper.setProps({ inputString: '{"a":2}' });

      expect(wrapper.vm.outputString).toBe(JSON.stringify({ a: 2 }, null, '\t'));
    });

    it('sets an error for invalid JSON', () => {
      const wrapper = mountAction(JsonFormat, { inputString: '{a:1}' });

      expect(wrapper.vm.error).not.toBe('');
      expect(wrapper.vm.outputString).toBe('');
    });
  });
});
