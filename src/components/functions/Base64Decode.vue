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
    // TODO output image/binary download
    outputString: function () {
      try {
        if (!/^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/.test(this.inputString)) {
          throw new Exception();
        }

        return Base64.decode(this.inputString);
      } catch (e) {
        return 'Invalid base64: ' + e.message;
      }
    }
  },
  canParse (str) {
    return /^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/.test(str);
  }
}
</script>
