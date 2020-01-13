<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      {{ error }}
    </NoteBlock>
    <md-field v-else>
      <md-textarea v-model="outputString" readonly/>
    </md-field>
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
  data () {
    return {
      error: ''
    };
  },
  computed: {
    // TODO output image/binary download
    outputString: function () {
      this.error = '';

      try {
        if (!/^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/.test(this.inputString)) {
          throw new Error();
        }

        return Base64.decode(this.inputString);
      } catch (e) {
        this.error = 'Invalid input: ' + e.message;

        return '';
      }
    }
  },
  canParse (str) {
    return /^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/.test(str);
  }
}
</script>
