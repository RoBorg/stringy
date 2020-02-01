<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to format
    </NoteBlock>
    <template v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Output</div>
        </md-card-header>

        <md-card-content>
          <pre v-highlightjs="outputString"><code class="sql"></code></pre>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary md-raised" @click="copy(outputString)">Copy</md-button>
        </md-card-actions>
      </md-card>
      <md-field>
        <label>Indent with</label>
      </md-field>

      <md-radio v-model="indentType" value="spaces">
        <md-field class="spaces-field">
          <md-input v-model="indentSpaces" type="number" min="1" max="8" class="spaces-input"/>
          <span class="md-suffix">Spaces</span>
        </md-field>
      </md-radio>
      <md-radio v-model="indentType" value="tabs">Tabs</md-radio>
    </template>
  </div>
</template>

<script>
  import sqlFormatter from 'sql-formatter';
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
      outputString: function () {
        const options = {
          indent: this.indentType === 'spaces' ? ' '.repeat(this.indentSpaces) : '\t'
        };

        return sqlFormatter.format(this.inputString, options);
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
