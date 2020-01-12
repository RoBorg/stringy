<template>
  <div>
    <Copy :text="outputString"/>
    <pre v-highlightjs="outputString"><code class="sql"></code></pre>
    <Copy :text="outputString"/>
  </div>
</template>

<script>
  import sqlFormatter from 'sql-formatter';

  // TODO options

  export default {
    name: 'SqlFormat',
    props: {
      inputString: {
        type: String,
        required: true
      }
    },
    computed: {
      outputString: function () {
        return sqlFormatter.format(this.inputString);
      }
    },
    canParse (str) {
      // This comment removal doesn't account for strings,
      // e.g. "this is not a comment /* so shouldn't be removed */"
      // but that doesn't matter since we're only interested in the first
      // non-comment word of the query, and that can't be a quoted string

      // Remove block comments
      str = str.replace(/\/\*[\s\S]*?\*\//g, '');

      // Remove single line comments
      str = str.replace(/--[^\r\n]*/g, '');

      return /^\s*(create|drop|show|rename|truncate|call|delete|do|handler|insert|load|replace|start|savepoint|rollback|lock|set|commit|purge|reset|set|change|start|stop|prepare|execute|deallocate|grant|revoke|analyze|check|checksum|optimize|repair|install|uninstall|binlog|cache|flush|kill|describe|explain|help|use|select|update|delete|alter)/i.test(str);
    }
  }
</script>
