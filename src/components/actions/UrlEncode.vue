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

  const unreserved = /[A-Za-z.~_-]/;
  const chars = [];

  for (let i = 0; i < 256; i++) {
    const char = String.fromCharCode(i);

    chars[i] = unreserved.test(char)
      ? char
      : '%' + i.toString(16).padStart(2, '0').toUpperCase()
  }

  export default {
    name: 'UrlEncode',
    mixins: [action],
    computed: {
      outputString: {
        get () {
          return this.useFile
            ? this.encode(this.inputFile.asArrayBuffer)
            : encodeURIComponent(this.text);
        },
        set () {
          // Do nothing
        }
      }
    },
    methods: {
      copy,
      encode (arrayBuffer) {
        return [...new Uint8Array(arrayBuffer)]
          .map(c => chars[c])
          .join('');
      }
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