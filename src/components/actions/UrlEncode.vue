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