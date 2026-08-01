<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to format
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      {{ error }}
    </NoteBlock>
    <template v-else>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Output</div>
        </div>

        <div class="card-content">
          <pre v-highlightjs="outputString"><code class="json"></code></pre>
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
  import action from './action.mixin';
  import { copy } from '../../helpers';

  export default {
    name: 'JsonFormat',
    mixins: [action],
    data() {
      return {
        indentType: 'spaces',
        indentSpaces: 4,
        error: '',
        outputString: ''
      }
    },
    watch: {
      text: {
        immediate: true,
        handler (value) {
          this.outputString = '';
          this.error = '';

          try {
            const json = JSON.parse(value);

            this.outputString = JSON.stringify(json, null, this.indentType === 'tabs' ? '\t' : parseInt(this.indentSpaces));
          } catch (e) {
            this.error = e.message;
          }
        },
        set () {
          // Do nothing
        }
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
