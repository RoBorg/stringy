<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to encode
    </NoteBlock>
    <template v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Output</div>
        </md-card-header>

        <md-card-content>
          <pre>{{ outputString }}</pre>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary md-raised" @click="copy(outputString)">Copy</md-button>
        </md-card-actions>
      </md-card>
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