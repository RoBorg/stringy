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
  import { encode } from 'he';
  import action from './action.mixin';
  import { copy } from '../../helpers';

  export default {
    name: 'HtmlEncode',
    mixins: [action],
    computed: {
      outputString: {
        get () {
          return encode(this.text, {useNamedReferences: true});
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