import { describe, it, expect } from 'vitest';
import Unknown from '../Unknown.vue';

describe('Unknown', () => {
  it('never claims to auto-match, since it is the fallback', () => {
    expect(Unknown.canParse('anything')).toBe(false);
  });
});
