import { describe, it, expect } from 'vitest';
import CSlashesEncode from '../CSlashesEncode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('CSlashesEncode', () => {
  it('never claims to auto-match', () => {
    expect(CSlashesEncode.canParse('anything')).toBe(false);
  });

  it('escapes control characters, backslashes and quotes', () => {
    const wrapper = mountAction(CSlashesEncode, { inputString: 'a\tb\nc\\d"e\'f' });

    expect(wrapper.vm.outputString).toBe('a\\tb\\nc\\\\d\\"e\\\'f');
  });
});
