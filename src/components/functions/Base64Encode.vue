<template>
  <div>
    <textarea v-model="outputString" class="output"/>
    <Copy :text="outputString"/>
    <label>
      <input type="checkbox" v-model="urlFriendly">
      URL friendly (use <code>-_</code> instead of <code>+/</code> <a href="https://tools.ietf.org/html/rfc4648" target="_blank">RFC 4648</a>)
    </label>
    <label>
      <input type="checkbox" v-model="wrap">
      Wrap at
    </label>
    <input type="number" min="1" v-model="wrapCharacters">
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
