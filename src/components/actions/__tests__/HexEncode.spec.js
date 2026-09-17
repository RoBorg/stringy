import { describe, it, expect } from 'vitest';
import HexEncode from '../HexEncode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('HexEncode', () => {
  it('never claims to auto-match', () => {
    expect(HexEncode.canParse('anything')).toBe(false);
  });

  it('encodes text to hex', () => {
    const wrapper = mountAction(HexEncode, { inputString: 'hello' });

    expect(wrapper.vm.outputString).toBe('68656c6c6f');
  });

  it('formats output into 16-byte rows when requested', async () => {
    const wrapper = mountAction(HexEncode, { inputString: 'a'.repeat(20) });

    await wrapper.setData({ format: true });

    const lines = wrapper.vm.outputString.split('\n').filter(Boolean);

    expect(lines.length).toBe(2);
  });

  it('encodes file contents when useFile is set', () => {
    const bytes = Uint8Array.from([0, 1, 255]);
    const wrapper = mountAction(HexEncode, {
      useFile: true,
      inputFile: { asArrayBuffer: bytes.buffer }
    });

    expect(wrapper.vm.outputString).toBe('0001ff');
  });
});
