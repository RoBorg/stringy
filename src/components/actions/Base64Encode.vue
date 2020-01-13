<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to encode
    </NoteBlock>
    <div v-else>
      <Copy :text="outputString"/>
      <md-field>
        <md-textarea v-model="outputString" readonly/>
      </md-field>
      <Copy :text="outputString"/>
      <br>
      <md-checkbox v-model="urlFriendly">
        URL friendly (use <code>-_</code> instead of <code>+/</code> <a href="https://tools.ietf.org/html/rfc4648" target="_blank">RFC 4648</a>)
      </md-checkbox>
      <md-checkbox v-model="wrap">
        Wrap at
        <md-field>
          <md-input type="number" min="1" v-model="wrapCharacters"/>
        </md-field>
      </md-checkbox>
    </div>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';

  export default {
    name: 'Base64Encode',
    props: {
      inputString: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        urlFriendly: false,
        wrap: true,
        wrapCharacters: 80
      };
    },
    computed: {
      outputString: function () {
        let str = Base64.encode(this.inputString, this.urlFriendly);

        if (this.wrap) {
          str = str.replace(new RegExp(`(.{${this.wrapCharacters}})`, 'g'), '$1\n');
        }

        return str;
      }
    },
    canParse () {
      return false;
    }
  }
</script>
