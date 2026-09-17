import { describe, it, expect } from 'vitest';
import Base64Encode from '../Base64Encode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('Base64Encode', () => {
  it('never claims to auto-match', () => {
    expect(Base64Encode.canParse('anything')).toBe(false);
  });

  it('encodes text to base64', () => {
    const wrapper = mountAction(Base64Encode, { inputString: 'hello' });

    expect(wrapper.vm.outputString).toBe('aGVsbG8=');
  });

  it('produces URL-friendly output when requested', async () => {
    const wrapper = mountAction(Base64Encode, { inputString: 'subjects?_d=1' });

    expect(wrapper.vm.outputString).toBe('c3ViamVjdHM/X2Q9MQ==');

    await wrapper.setData({ urlFriendly: true });

    expect(wrapper.vm.outputString).toBe('c3ViamVjdHM_X2Q9MQ');
  });

  it('wraps output at the given width', async () => {
    const wrapper = mountAction(Base64Encode, { inputString: 'a'.repeat(100) });

    await wrapper.setData({ wrap: true, wrapCharacters: 10 });

    const lines = wrapper.vm.outputString.split('\n').filter(Boolean);

    expect(lines.every(line => line.length <= 10)).toBe(true);
  });

  it('encodes file contents as a data URL when useFile is set', () => {
    const wrapper = mountAction(Base64Encode, {
      useFile: true,
      inputFile: { asDataUrl: 'data:text/plain;base64,aGVsbG8=' }
    });

    expect(wrapper.vm.outputString).toBe('aGVsbG8=');
  });
});
