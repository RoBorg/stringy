import { describe, it, expect, afterEach, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import Url from '../Url.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('Url', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('canParse', () => {
    it('accepts strings with a scheme', () => {
      expect(Url.canParse('http://example.com')).toBe(true);
      expect(Url.canParse('ftp://example.com')).toBe(true);
    });

    it('rejects strings without a scheme', () => {
      expect(Url.canParse('example.com')).toBe(false);
    });
  });

  describe('url computed', () => {
    it('parses the parts of a URL', () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) }));

      const wrapper = mountAction(Url, { inputString: 'https://example.com:8080/a/b?x=1&y=2#frag' });

      expect(wrapper.vm.url.protocol).toBe('https');
      expect(wrapper.vm.url.hostname).toBe('example.com');
      expect(wrapper.vm.url.port).toBe('8080');
      expect(wrapper.vm.url.pathname).toBe('/a/b');
      expect(wrapper.vm.url.search).toBe('x=1&y=2');
      expect(wrapper.vm.url.hash).toBe('frag');
      expect(wrapper.vm.url.searchObject).toEqual([
        { name: 'x', value: '1', nameDecoded: 'x', valueDecoded: '1' },
        { name: 'y', value: '2', nameDecoded: 'y', valueDecoded: '2' }
      ]);
    });

    it('flags a query string with encoded characters', () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) }));

      const wrapper = mountAction(Url, { inputString: 'https://example.com/?q=a%20b' });

      expect(wrapper.vm.url.hasEncodedQuery).toBe(true);
      expect(wrapper.vm.url.searchObject[0].valueDecoded).toBe('a b');
    });

    it('decodes an encoded pathname and hash', () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) }));

      const wrapper = mountAction(Url, { inputString: 'https://example.com/a%20b#c%20d' });

      expect(wrapper.vm.url.pathnameDecoded).toBe('/a b');
      expect(wrapper.vm.url.hashDecoded).toBe('c d');
    });
  });

  describe('IP lookup', () => {
    // The debounced watcher schedules its lookup with lodash's own real
    // setTimeout (captured before fake timers could be installed), so we
    // wait out the real 500ms debounce here instead of faking it.
    it('resolves and stores the hostname IP and geolocation info', async () => {
      const fetchMock = vi.fn()
        .mockResolvedValueOnce({ json: () => Promise.resolve({ Answer: [{ data: '93.184.216.34' }] }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ org: 'Example Org' }) });

      vi.stubGlobal('fetch', fetchMock);

      const wrapper = mountAction(Url, { inputString: 'https://example.com/' });

      await new Promise(resolve => setTimeout(resolve, 600));
      await flushPromises();

      expect(wrapper.vm.ip).toBe('93.184.216.34');
      expect(wrapper.vm.ipInfo).toEqual({ org: 'Example Org' });
      expect(wrapper.vm.ipError).toBe('');
    }, 2000);
  });
});
