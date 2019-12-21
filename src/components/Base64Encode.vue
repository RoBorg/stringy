<template>
  <div>
    <textarea v-model="outputString" class="output"/>
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
  computed: {
    outputString: function () {
      return Base64.encode(this.inputString);
    }
  },
  canParse () {
    return false;
  }
}
</script>
