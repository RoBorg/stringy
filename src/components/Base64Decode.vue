<template>
  <div>
    <textarea v-model="outputString"/>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';

// TODO options, binary decode

export default {
  name: 'Base64Decode',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    outputString: function () {
      return Base64.decode(this.inputString);
    }
  },
  canParse (str) {
    return str.match(/^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/);
  }
}
</script>
