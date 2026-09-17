import { describe, it, expect, afterEach, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import IpAddress from '../IpAddress.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('IpAddress', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('canParse', () => {
    it('accepts an IP address, with or without a CIDR suffix', () => {
      expect(IpAddress.canParse('192.168.1.1')).toBe(true);
      expect(IpAddress.canParse('192.168.1.0/24')).toBe(true);
    });

    it('rejects invalid addresses', () => {
      expect(IpAddress.canParse('999.1.1.1')).toBe(false);
      expect(IpAddress.canParse('not an ip')).toBe(false);
    });
  });

  describe('output', () => {
    it('computes network info for a plain IP address (implicit /32)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) }));

      const wrapper = mountAction(IpAddress, { inputString: '192.168.1.1' });
      await flushPromises();

      expect(wrapper.vm.info.networkAddress).toBe('192.168.1.1');
      expect(wrapper.vm.info.mask).toBe('255.255.255.255');
      expect(wrapper.vm.info.hosts).toBe(1);
      expect(wrapper.vm.error).toBe(false);
    });

    it('computes CIDR range info', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) }));

      const wrapper = mountAction(IpAddress, { inputString: '192.168.1.0/24' });
      await flushPromises();

      expect(wrapper.vm.info.networkAddress).toBe('192.168.1.0');
      expect(wrapper.vm.info.broadcastAddress).toBe('192.168.1.255');
      expect(wrapper.vm.info.firstUsableAddress).toBe('192.168.1.1');
      expect(wrapper.vm.info.lastUsableAddress).toBe('192.168.1.254');
      expect(wrapper.vm.info.mask).toBe('255.255.255.0');
      expect(wrapper.vm.info.hosts).toBe('255');
    });

    it('flags an invalid address as an error', () => {
      const wrapper = mountAction(IpAddress, { inputString: 'not an ip' });

      expect(wrapper.vm.error).toBe(true);
    });

    it('populates geolocation info from the lookup service', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ ip: '192.168.1.1', city: 'Springfield', country: 'USA' })
      }));

      const wrapper = mountAction(IpAddress, { inputString: '192.168.1.1' });
      await flushPromises();

      expect(wrapper.vm.ipInfo).toEqual({ ip: '192.168.1.1', city: 'Springfield', country: 'USA' });
    });
  });
});
