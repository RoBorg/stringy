import { describe, it, expect } from 'vitest';
import HtmlEncode from '../HtmlEncode.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('HtmlEncode', () => {
  it('never claims to auto-match', () => {
    expect(HtmlEncode.canParse('anything')).toBe(false);
  });

  it('encodes reserved characters as named entities', () => {
    const wrapper = mountAction(HtmlEncode, { inputString: 'Tom & Jerry <3' });

    expect(wrapper.vm.outputString).toBe('Tom &amp; Jerry &lt;3');
  });
});
