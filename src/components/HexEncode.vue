<template>
  <div>
    <textarea v-model="outputString" class="output"/>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';

// TODO options, binary decode

export default {
  name: 'HexEncode',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    outputString: function () {
      return Base64.encode(this.inputString);
    }
  },
  canParse (str) {
    return false;
  }
}
</script>
