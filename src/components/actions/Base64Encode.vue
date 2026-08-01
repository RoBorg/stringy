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
          <div class="field">
            <textarea v-model="outputString" readonly/>
          </div>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-primary" @click="copy(outputString)">Copy</button>
        </div>
      </div>

      <label class="checkbox">
        <input type="checkbox" v-model="urlFriendly">
        URL friendly (use <code>-_</code> instead of <code>+/</code> <a href="https://tools.ietf.org/html/rfc4648" target="_blank">RFC 4648</a>)
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="wrap">
        Wrap at
        <input type="number" min="1" v-model="wrapCharacters">
      </label>
    </template>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import action from './action.mixin';
  import { copy } from '../../helpers';

  export default {
    name: 'Base64Encode',
    mixins: [action],
    data() {
      return {
        urlFriendly: false,
        wrap: true,
        wrapCharacters: 80
      };
    },
    methods: {
      copy
    },
    computed: {
      outputString: {
        get () {
          let str = this.useFile
            ? this.inputFile.asDataUrl.replace(/^data:.*?;base64,/, '')
            : Base64.encode(this.inputString);

          if (this.urlFriendly) {
            str = str
              .replace(/[+/]/g, c => c === '+' ? '-' : '_')
              .replace(/=+$/g, '');
          }

          if (this.wrap) {
            str = str.replace(new RegExp(`(.{${this.wrapCharacters}})`, 'g'), '$1\n');
          }

          return str;
        },
        set () {
          // Do nothing
        }
      }
    },
    canParse () {
      return false;
    }
  }
</script>
