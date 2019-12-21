<template>
  <div>
    <a :href="url.href" target="_blank">Link</a>
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Protocol</th>
          <td>{{ url.protocol }}</td>
        </tr>
        <tr>
          <th>Host</th>
          <td>{{ url.host }}</td>
        </tr>
        <tr>
          <th>Hostname</th>
          <td>{{ url.hostname }}</td>
        </tr>
        <tr>
          <th>Port</th>
          <td>{{ url.port }}</td>
        </tr>
        <tr>
          <th>Pathname</th>
          <td>{{ url.pathname }}</td>
        </tr>
        <tr>
          <th>Search</th>
          <td>{{ url.search }}</td>
        </tr>
        <tr>
          <th>Search Parameters</th>
          <td>
            <table>
                <tbody>
                  <tr v-for="query in url.searchObject">
                    <td>{{ query.name }}</td>
                    <td>{{ query.value }}</td>
                  </tr>
                </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th>Hash</th>
          <td>{{ url.hash }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// TODO options

export default {
  name: 'UrlDecode',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    outputString: function () {
      const url = this.url;

      return this.inputString;
    },
    url: function () {
      const parser = document.createElement('a');
      const searchObject = [];

      parser.href = this.inputString.trim();

      // Convert query string to object
      const queries = parser.search.replace(/^\?/, '').split('&');

      for (let i = 0; i < queries.length; i++) {
          const split = queries[i].split('=');
          searchObject.push({
            name: split[0],
            value: split[1]
          });
      }
      return {
          href: parser.href,
          protocol: parser.protocol,
          host: parser.host,
          hostname: parser.hostname,
          port: parser.port,
          pathname: parser.pathname,
          search: parser.search.replace(/^\?/, ''),
          searchObject: searchObject,
          hash: parser.hash.replace(/^#/, '')
      };
    }
  },
  canParse (str) {
    return /^\S+:\/\//.test(str);
  }
}
</script>
