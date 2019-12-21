<template>
  <div>
    <textarea v-model="outputString" class="output"/>
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
    return /^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/.test(str)
      && !/^\d+$/.test(str);
  }
}
</script>
