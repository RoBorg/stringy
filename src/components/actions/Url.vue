<template>
  <div>
    <div v-if="!url">
      Malformed Url
    </div>
    <div v-else style="display: flex; flex-wrap: wrap;">
      <table class="data">
        <tbody>
          <tr>
            <th>Links</th>
            <td>
              <a :href="url.href" target="_blank">Visit</a> /
              <a :href="`https://www.sslshopper.com/ssl-checker.html#hostname=${encodeURIComponent(url.hostname)}`" target="_blank" download>Quick SSL check</a> /
              <a :href="`https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(url.hostname)}&hideResults=on&latest`" target="_blank" download>SSL Labs report</a> /
              <a :href="`https://whois.domaintools.com/${encodeURIComponent(url.hostname)}`" target="_blank">Domain WHOIS</a>
            </td>
          </tr>
          <tr>
            <th>Protocol</th>
            <td>
              {{ url.protocol }}
              <Copy :text="url.protocol"/>
            </td>
          </tr>
          <tr v-if="url.host !== url.hostname">
            <th>Host</th>
            <td>
              {{ url.host }}
              <Copy :text="url.host"/>
            </td>
          </tr>
          <tr>
            <th>Hostname</th>
            <td>
              <a :href="`${url.protocol}://${url.hostname}`" target="_blank">{{ url.hostname }}</a>
              <Copy :text="url.hostname"/>
            </td>
          </tr>
          <tr>
            <th>IP</th>
            <td>
              <template v-if="ipLoading">
                Loading
              </template>
              <template v-else-if="ipError">
                {{ ipError }}
              </template>
              <template v-else>
                {{ ip }}
                <Copy :text="ip"/>
              </template>
            </td>
          </tr>
          <tr>
            <th>IP Org</th>
            <td>
              <template v-if="ipInfoLoading">
                Loading
              </template>
              <template v-else-if="ipInfoError">
                {{ ipInfoError }}
              </template>
              <template v-else-if="ipInfo.org">
                {{ ipInfo.org }}
                <Copy :text="ipInfo.org"/>
              </template>
            </td>
          </tr>
          <tr v-if="url.port">
            <th>Port</th>
            <td>
              {{ url.port }}
              <Copy :text="url.port"/>
            </td>
          </tr>
          <tr v-if="url.pathname">
            <th>Pathname</th>
            <td>
              {{ url.pathname }}
              <Copy :text="url.pathname"/>
            </td>
          </tr>
          <tr v-if="url.pathname && (url.pathname !== url.pathnameDecoded)">
            <th>Pathname (Decoded)</th>
            <td>
              {{ url.pathnameDecoded }}
              <Copy :text="url.pathnameDecoded"/>
            </td>
          </tr>
          <tr v-if="url.search">
            <th>Search</th>
            <td>
              {{ url.search }}
              <Copy :text="url.search"/>
            </td>
          </tr>
          <tr v-if="url.search">
            <th>Search Parameters</th>
            <td class="with-subtable">
              <table class="data parameters">
                  <tbody>
                    <tr v-for="query in url.searchObject">
                      <td>
                        {{ query.name }}
                        <Copy :text="query.name"/>
                      </td>
                      <td>
                        {{ query.value }}
                        <Copy :text="query.value"/>
                      </td>
                    </tr>
                  </tbody>
              </table>
            </td>
          </tr>
          <tr v-if="url.search && url.hasEncodedQuery">
            <th>Search Parameters (Decoded)</th>
            <td class="with-subtable">
              <table class="data parameters">
                  <tbody>
                    <tr v-for="query in url.searchObject">
                      <td>
                        {{ query.nameDecoded }}
                        <Copy :text="query.nameDecoded"/>
                      </td>
                      <td>
                        {{ query.valueDecoded }}
                        <Copy :text="query.valueDecoded"/>
                      </td>
                    </tr>
                  </tbody>
              </table>
            </td>
          </tr>
          <tr v-if="url.hash">
            <th>Hash</th>
            <td>
              {{ url.hash }}
              <Copy :text="url.hash"/>
            </td>
          </tr>
          <tr v-if="url.hash && (url.hash !== url.hashDecoded)">
            <th>Hash (Decoded)</th>
            <td>
              {{ url.hashDecoded }}
              <Copy :text="url.hashDecoded"/>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="data">
        <tbody>
          <tr>
            <th>Link QR Code</th>
            <td>
              <qrcode-vue :value="url.href" size="200"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  import { debounce} from 'lodash';
  import action from './action.mixin';
  import { getIp, getIpInfo } from '../../helpers';

  export default {
    name: 'Url',
    mixins: [action],
    components: {
      QrcodeVue,
    },
    data () {
      return {
        ip: '',
        ipError: '',
        ipLoading: true,
        ipInfo: {},
        ipInfoError: '',
        ipInfoLoading: true,
        oldHostname: '',
        version: 0
      };
    },
    computed: {
      url () {
        try {
          const parser = document.createElement('a');
          const searchObject = [];

          parser.href = this.text.trim();

          // Convert query string to object
          const queries = parser.search.replace(/^\?/, '').split(/&|;/);
          let hasEncodedQuery = false;

          for (let i = 0; i < queries.length; i++) {
              const split = queries[i].split('=');
              const part = {
                name: split[0],
                value: split[1],
                nameDecoded: decodeURIComponent(split[0]),
                valueDecoded: decodeURIComponent(split[1])
              };

              searchObject.push(part);

              if ((part.name !== part.nameDecoded) || (part.value !== part.valueDecoded)) {
                hasEncodedQuery = true;
              }
          }

          const url = {
              href: parser.href,
              protocol: parser.protocol.replace(/:$/, ''),
              host: parser.host,
              hostname: parser.hostname,
              port: parser.port,
              pathname: parser.pathname,
              pathnameDecoded: decodeURIComponent(parser.pathname),
              search: parser.search.replace(/^\?/, ''),
              searchObject: searchObject,
              hash: parser.hash.replace(/^#/, ''),
              hashDecoded: decodeURIComponent(parser.hash.replace(/^#/, '')),
              hasEncodedQuery
          };

          return url;
        } catch (e) {
          return false;
        }
      }
    },
    watch: {
      url: {
        handler: debounce(async function (value) {
          if (this.oldHostname === value.hostname) {
            return;
          }

          this.ip = '';
          this.ipError = '';
          this.ipLoading = true;
          this.ipInfo = {};
          this.ipInfoError = '';
          this.ipInfoLoading = true;
          this.version++;
          this.oldHostname = value.hostname;

          const currentVersion = this.version;

          try {
            const ip = await getIp(value.hostname);

            if (this.version !== currentVersion) {
              return;
            }

            this.ip = ip;
          } catch (e) {
            this.ipError = e.message;
            this.ipInfoError = '-';

            return;
          } finally {
            this.ipLoading = false;
            this.ipInfoLoading = false;
          }

          try {
            const ipInfo = await getIpInfo(this.ip);

            if (this.version !== currentVersion) {
              return;
            }

            this.ipInfo = ipInfo;
          } catch (e) {
            this.ipInfoError = e.message;

            return;
          } finally {
            this.ipInfoLoading = false;
          }
        }, 500),
        immediate: true
      }
    },
    canParse (str) {
      return /^\S+:\/\//.test(str);
    }
  }
</script>

<style scoped lang="css">
  .parameters {
    width: 100%;
  }
</style>
