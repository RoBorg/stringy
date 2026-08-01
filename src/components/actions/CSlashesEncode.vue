<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to encode
    </NoteBlock>
    <template v-else>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Output</div>
        </div>

        <div class="card-content">
          <pre>{{ outputString }}</pre>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-primary" @click="copy(outputString)">Copy</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import action from './action.mixin';
  import { copy } from '../../helpers';

  export default {
    name: 'CSlashesEncode',
    mixins: [action],
    computed: {
      outputString: {
        get () {
          return this.text.replace(/\\/g, '\\\\')
            .replace(/\u0008/g, '\\b') // eslint-disable-line no-control-regex
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\f/g, '\\f')
            .replace(/\r/g, '\\r')
            .replace(/'/g, '\\\'')
            .replace(/"/g, '\\"')
        },
        set () {
          // Do nothing
        }
      }
    },
    methods: {
      copy
    },
    canParse () {
      return false;
    }
  }
</script>

<style scoped lang="css">
  pre {
    overflow: auto;
  }
</style>