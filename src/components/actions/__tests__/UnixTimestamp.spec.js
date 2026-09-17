import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import UnixTimestamp from '../UnixTimestamp.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('UnixTimestamp', () => {
  // The component starts a setInterval() in created() with no cleanup,
  // so use fake timers to keep it from leaking a real timer per test.
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('canParse', () => {
    it('accepts 10-digit and 13-digit timestamps', () => {
      expect(UnixTimestamp.canParse('1516239022')).toBe(true);
      expect(UnixTimestamp.canParse('1516239022000')).toBe(true);
    });

    it('rejects other lengths and non-numeric strings', () => {
      expect(UnixTimestamp.canParse('12345')).toBe(false);
      expect(UnixTimestamp.canParse('not a number')).toBe(false);
    });
  });

  describe('output', () => {
    it('treats a 10-digit value as seconds', () => {
      const wrapper = mountAction(UnixTimestamp, { inputString: '1516239022' });

      expect(wrapper.vm.date.getTime()).toBe(1516239022000);
      expect(wrapper.vm.date.toISOString()).toBe('2018-01-18T01:30:22.000Z');
      expect(wrapper.vm.error).toBe('');
    });

    it('treats a 13-digit value as milliseconds', () => {
      const wrapper = mountAction(UnixTimestamp, { inputString: '1516239022123' });

      expect(wrapper.vm.date.getTime()).toBe(1516239022123);
    });

    it('sets an error for a non-numeric timestamp', () => {
      const wrapper = mountAction(UnixTimestamp, { inputString: 'not a number' });

      expect(wrapper.vm.error).toBe('Invalid timestamp');
    });
  });
});
