<template>
  <div>
    <table class="data">
      <tbody>
        <tr>
          <th>CIDR Range</th>
          <td>
            {{ inputString }}
            <Copy :text="inputString"/>
          </td>
        </tr>
        <tr>
          <th>Network Address</th>
          <td>
            {{ info.networkAddress }}
            <Copy :text="info.networkAddress"/>
          </td>
        </tr>
        <tr>
          <th>First Usable IP</th>
          <td>
            {{ info.firstUsableAddress }}
            <Copy :text="info.firstUsableAddress"/>
          </td>
        </tr>
        <tr>
          <th>Last Usable IP</th>
          <td>
            {{ info.lastUsableAddress }}
            <Copy :text="info.lastUsableAddress"/>
          </td>
        </tr>
        <tr v-if="info.networkBits > 0">
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
      </tbody>
    </table>
  </div>
</template>

<script>
// TODO options

const regEx = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?:\/([12]?\d|3[12]))?$/;

export default {
  name: 'IpAddress',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    info: function () {
      const parts = this.inputString.trim().split('/');
      const ip = parts[0];
      const ipInt = this.ipToInt(ip);
      const networkBits = parts[1] || 32;
      const hostBits = 32 - networkBits;
      const octets = parts[0].split('.');
      const hostInt = (((1 << hostBits) - 1) >>> 0);
      const maskInt = (((1 << networkBits) - 1) << hostBits) >>> 0;
      const mask = this.intToIp(maskInt);
      const networkAddressInt = (ipInt & maskInt) >>> 0;
      const networkAddress = this.intToIp(networkAddressInt);
      const broadcastAddressInt = (networkAddressInt + hostInt) >>> 0;
      const broadcastAddress = this.intToIp(broadcastAddressInt);
      const networkAddres = this.intToIp(networkAddressInt);
      const firstUsableAddress = this.intToIp(networkAddressInt + 1);
      const lastUsableAddress = this.intToIp(broadcastAddressInt - 1);
      const hosts = ((2 ** hostBits) - (networkBits ? 1 : 0)).toLocaleString();

      return {
        ip,
        networkBits,
        octets,
        mask,
        networkAddress,
        broadcastAddress,
        firstUsableAddress,
        lastUsableAddress,
        hosts
      }
    },
    outputString: function () {
      const url = this.url;

      return this.inputString;
    },
    hosts: function () {
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
  canParse (str) {
    return regEx.test(str);
  }
}
</script>

<style scoped lang="css">
tbody th {
  text-align: right;
}

table.data {
  border-collapse: collapse;
}

table.data th,
table.data td {
  background-color: #ffffff;
  border-top: 1px solid #dddddd;
  padding: 8px 10px;
}

table.data td {
  font-family: 'Courier New', Courier, monospace;
}

table.data > tbody > tr:nth-child(even) > td {
  background-color: #f9f9f9;
}

table.data > tbody > tr:nth-child(even) > th {
  background-color: #f1f1f1;
}

table.data > tbody > tr:hover > th {
  background-color: #eaeaea;
}

table.data > tbody > tr:hover > td {
  background-color: #f6f6f6;
}

table.data > tbody > tr:first-child > th,
table.data > tbody > tr:first-child > td {
  border-top-width: 0;
}

.parameters {
  width: 100%;
}

</style>