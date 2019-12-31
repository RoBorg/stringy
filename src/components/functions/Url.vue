<template>
  <div>
    <div v-if="!url">
      Malformed Url
    </div>
    <div v-else>
      <table class="data">
        <tbody>
          <tr>
            <th>Link</th>
            <td>
              <a :href="url.href" target="_blank">Click here</a>
            </td>
          </tr>
          <tr>
            <th>Link QR Code</th>
            <td>
              <qrcode-vue :value="url.href" size="200"/>
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
              <a :href="`${url.protocol}:${url.hostname}`" target="_blank">{{ url.hostname }}</a>
              <Copy :text="url.hostname"/>
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
            <td>
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
            <td>
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
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';

// TODO options
// TODO link to domain whois, ip lookup (if we can't do it ourselves), ssl info

export default {
  name: 'Url',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  components: {
    QrcodeVue,
  },
  computed: {
    outputString: function () {
      const url = this.url;

      return this.inputString;
    },
    url: function () {
      try {
        const parser = document.createElement('a');
        const searchObject = [];

        parser.href = this.inputString.trim();

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