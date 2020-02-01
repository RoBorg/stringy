<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to format
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      {{ error }}
    </NoteBlock>
    <template v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Output</div>
        </md-card-header>

        <md-card-content>
          <pre v-highlightjs="outputString"><code class="json"></code></pre>
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
  import action from './action.mixin';
  import { copy } from '../../helpers';

  export default {
    name: 'JsonFormat',
    mixins: [action],
    data() {
      return {
        indentType: 'spaces',
        indentSpaces: 4,
        error: ''
      }
    },
    computed: {
      outputString: function () {
        this.error = '';

        try {
          const json = JSON.parse(this.inputString)
          return JSON.stringify(json, null, this.indentType === 'tabs' ? '\t' : parseInt(this.indentSpaces));
        } catch (e) {
          this.error = e.message;
        }

        return '';
      }
    },
    methods: {
      copy
    },
    canParse (str) {
      // Don't JSON-decode raw values, e.g. 123456
      if (!/{|\[/.test(str)) {
        return false;
      }

      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }

      return true;
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
