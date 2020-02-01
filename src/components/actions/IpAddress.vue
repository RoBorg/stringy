<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      Invalid IP address / CIDR
    </NoteBlock>
    <template v-else>
      <NoteBlock warning v-if="info.networkAddress !== info.ip">
        Invalid CIDR - The IP address should be the network address
      </NoteBlock>
      <table class="data">
        <tbody>
          <tr>
            <th>CIDR Range</th>
            <td>
              {{ info.networkAddress }}/{{ info.networkBits }}
              <Copy :text="`${info.networkAddress}/${info.networkBits}`"/>
            </td>
          </tr>
          <tr v-if="info.hostBits > 0">
            <th>Network Address</th>
            <td>
              {{ info.networkAddress }}
              <Copy :text="info.networkAddress"/>
            </td>
          </tr>
          <tr v-if="info.hostBits > 0">
            <th>First Usable IP</th>
            <td>
              {{ info.firstUsableAddress }}
              <Copy :text="info.firstUsableAddress"/>
            </td>
          </tr>
          <tr v-if="info.hostBits > 0">
            <th>Last Usable IP</th>
            <td>
              {{ info.lastUsableAddress }}
              <Copy :text="info.lastUsableAddress"/>
            </td>
          </tr>
          <tr v-if="info.hostBits > 0">
            <th>Broadcast Address</th>
            <td>
              {{ info.broadcastAddress }}
              <Copy :text="info.broadcastAddress"/>
            </td>
          </tr>
          <tr>
            <th>Mask</th>
            <td>
              {{ info.mask }}
              <Copy :text="info.mask"/>
            </td>
          </tr>
          <tr>
            <th>Hosts</th>
            <td>
              {{ info.hosts }}
            </td>
          </tr>
          <template v-if="ipInfo.status === 'success'">
            <tr v-if="ipInfo.businessName">
              <th>Business Name</th>
              <td>{{ ipInfo.businessName }}</td>
            </tr>
            <tr v-if="ipInfo.businessWebsite">
              <th>Business Website</th>
              <td>{{ ipInfo.businessWebsite }}</td>
            </tr>
            <tr v-if="ipInfo.city">
              <th>City</th>
              <td>{{ ipInfo.city }}</td>
            </tr>
            <tr v-if="ipInfo.continent">
              <th>Continent</th>
              <td>{{ ipInfo.continent }}</td>
            </tr>
            <tr v-if="ipInfo.country">
              <th>Country</th>
              <td>{{ ipInfo.country }}</td>
            </tr>
            <tr v-if="ipInfo.countryCode">
              <th>Country Code</th>
              <td>{{ ipInfo.countryCode }}</td>
            </tr>
            <tr v-if="ipInfo.ipName">
              <th>IP Name</th>
              <td>{{ ipInfo.ipName }}</td>
            </tr>
            <tr v-if="ipInfo.ipType">
              <th>IP Type</th>
              <td>{{ ipInfo.ipType }}</td>
            </tr>
            <tr v-if="ipInfo.isp">
              <th>ISP</th>
              <td>{{ ipInfo.isp }}</td>
            </tr>
            <tr v-if="ipInfo.lat">
              <th>Latitude</th>
              <td>{{ ipInfo.lat }}</td>
            </tr>
            <tr v-if="ipInfo.lon">
              <th>Longitude</th>
              <td>{{ ipInfo.lon }}</td>
            </tr>
            <tr v-if="ipInfo.lat && ipInfo.lon">
              <th>Map</th>
              <td><a :href="`https://www.google.com/maps/@${ipInfo.lat},${ipInfo.lon},8z`" target="_blank">Google Maps</a></td>
            </tr>
            <tr v-if="ipInfo.org">
              <th>Org</th>
              <td>{{ ipInfo.org }}</td>
            </tr>
            <tr v-if="ipInfo.query">
              <th>Query</th>
              <td>{{ ipInfo.query }}</td>
            </tr>
            <tr v-if="ipInfo.region">
              <th>Region</th>
              <td>{{ ipInfo.region }}</td>
            </tr>
          </template>
          <template v-else-if="ipInfo.status">
            <tr>
              <th>IP Info</th>
              <td>{{ ipInfo.status }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
  import action from './action.mixin';
  import { getIpInfo } from '../../helpers';

  const regEx = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?:\/([12]?\d|3[012]))?$/;

  export default {
    name: 'IpAddress',
    mixins: [action],
    data () {
      return {
        ipInfo: {}
      };
    },
    computed: {
      error () {
        return !regEx.test(this.text);
      },
      info () {
        const parts = this.text.trim().split('/');
        const ip = parts[0];
        const ipInt = this.ipToInt(ip);
        const networkBits = parts[1] || 32;
        const hostBits = 32 - networkBits;
        const octets = parts[0].split('.');
        const hostInt = (((1 << hostBits) - 1) >>> 0);
        const maskInt = (((1 << networkBits) - 1) << hostBits) >>> 0;
        const mask = hostBits ? this.intToIp(maskInt) : '255.255.255.255';
        const networkAddressInt = (ipInt & maskInt) >>> 0;
        const networkAddress = hostBits ? this.intToIp(networkAddressInt) : ip;
        const broadcastAddressInt = (networkAddressInt + hostInt) >>> 0;
        const broadcastAddress = this.intToIp(broadcastAddressInt);
        const firstUsableAddress = this.intToIp(networkAddressInt + 1);
        const lastUsableAddress = this.intToIp(broadcastAddressInt - 1);
        const hosts = hostBits ? ((2 ** hostBits) - (networkBits ? 1 : 0)).toLocaleString() : 1;

        return {
          ip,
          networkBits,
          hostBits,
          octets,
          mask,
          networkAddress,
          broadcastAddress,
          firstUsableAddress,
          lastUsableAddress,
          hosts
        }
      },
      hosts () {
        return (2 ** (32 - this.info.networkBits)).toLocaleString();
      }
    },
    methods: {
      ipToInt (ip) {
        return ip
          .split('.')
          .reduce((ipInt, octet) => (ipInt << 8) + parseInt(octet, 10), 0) >>> 0;
      },
      intToIp (ipInt) {
        return (ipInt >>> 24)
          + '.' + (ipInt >> 16 & 255)
          + '.' + (ipInt >> 8 & 255)
          + '.' + (ipInt & 255);
      }
    },
    watch: {
      text: {
        handler: async function (value) {
          this.ipInfo = {};

          if (this.error) {
            return;
          }

          const parts = value.trim().split('/');

          if (parts.length > 1) {
            return;
          }

          this.ipInfo = {status: 'Loading'};

          try {
            this.ipInfo = await getIpInfo(parts[0]);
          } catch (e) {
            this.ipInfo = {status: e.message};
          }
        },
        immediate: true
      }
    },
    canParse (str) {
      return regEx.test(str);
    }
  }
</script>

<style scoped lang="css">
  .parameters {
    width: 100%;
  }
</style>