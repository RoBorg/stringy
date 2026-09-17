import { describe, it, expect } from 'vitest';
import UrlEncode from '../UrlEncode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('UrlEncode', () => {
  it('never claims to auto-match', () => {
    expect(UrlEncode.canParse('anything')).toBe(false);
  });

  it('percent-encodes reserved characters', () => {
    const wrapper = mountAction(UrlEncode, { inputString: 'hello world/?=' });

    expect(wrapper.vm.outputString).toBe(encodeURIComponent('hello world/?='));
  });

  it('encodes file contents byte-by-byte when useFile is set', () => {
    const bytes = Uint8Array.from([0x68, 0x69, 0x20, 0xff]);
    const wrapper = mountAction(UrlEncode, {
      useFile: true,
      inputFile: { asArrayBuffer: bytes.buffer }
    });

    expect(wrapper.vm.outputString).toBe('hi%20%FF');
  });
});
