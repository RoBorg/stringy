<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to format
    </NoteBlock>
    <template v-else>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Output</div>
        </div>

        <div class="card-content">
          <pre v-highlightjs="outputString"><code class="sql"></code></pre>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-primary" @click="copy(outputString)">Copy</button>
        </div>
      </div>
      <div class="field">
        <label>Indent with</label>
      </div>

      <label class="radio">
        <input type="radio" v-model="indentType" value="spaces">
        <span class="spaces-field">
          <input type="number" v-model="indentSpaces" min="1" max="8" class="spaces-input">
          Spaces
        </span>
      </label>
      <label class="radio">
        <input type="radio" v-model="indentType" value="tabs">
        Tabs
      </label>
    </template>
  </div>
</template>

<script>
  import { format } from 'sql-formatter';
  import action from './action.mixin';
  import { copy } from '../../helpers';

  export default {
    name: 'SqlFormat',
    mixins: [action],
    data() {
      return {
        indentType: 'spaces',
        indentSpaces: 4
      }
    },
    computed: {
      outputString () {
        const options = this.indentType === 'spaces'
          ? { tabWidth: this.indentSpaces, useTabs: false }
          : { useTabs: true };

        return format(this.text, options);
      }
    },
    methods: {
      copy
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

<style scoped>
  .spaces-field {
    vertical-align: middle;
    padding-top: 0;
    margin: 0;
    min-height: 20px;
    height: 20px;
    line-height: 20px;
  }

  .spaces-field .spaces-input {
    width: 2em;
    height: 20px;
  }
</style>
