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
          <md-field>
            <md-textarea v-model="outputString" readonly/>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary md-raised" @click="copy(outputString)">Copy</md-button>
        </md-card-actions>
      </md-card>

      <md-checkbox v-model="urlFriendly">
        URL friendly (use <code>-_</code> instead of <code>+/</code> <a href="https://tools.ietf.org/html/rfc4648" target="_blank">RFC 4648</a>)
      </md-checkbox>
      <md-checkbox v-model="wrap">
        Wrap at
        <md-field>
          <md-input type="number" min="1" v-model="wrapCharacters"/>
        </md-field>
      </md-checkbox>
    </template>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import action from './action.mixin';

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
