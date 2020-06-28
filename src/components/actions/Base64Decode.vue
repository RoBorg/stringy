<template>
  <div>
    <NoteBlock alert v-if="error"> Error: {{ error }} </NoteBlock>
    <Output v-else :int-array="intArray" />
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import action from "./action.mixin";

const regEx = /^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/;

export default {
  name: "Base64Decode",
  mixins: [action],
  data() {
    return {
      error: "",
      intArray: null
    };
  },
  watch: {
    text: {
      immediate: true,
      handler: function(value) {
        try {
          this.error = "";

          if (!regEx.test(value)) {
            throw new Error("Invalid Base64 data");
          }

          this.intArray = this.toIntArray(Base64.atob(value));
        } catch (e) {
          this.error = e.message;
        }
      }
    }
  },
  methods: {
    toIntArray(str) {
      return Uint8Array.from(str, c => c.charCodeAt(0));
    }
  },
  canParse(str) {
    return regEx.test(str);
  }
};
</script>
