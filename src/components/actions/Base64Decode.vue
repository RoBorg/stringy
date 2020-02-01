<template>
  <div>
    <NoteBlock alert v-if="error">
      Error: {{ error }}
    </NoteBlock>
    <Output v-else :int-array="intArray"/>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Base64 } from 'js-base64';
  import Output from '../Output';

  const regEx = /^([A-Za-z0-9+/\s]+|[A-Za-z0-9-_\s]+)[=\s]*$/;

  export default {
    name: 'Base64Decode',
    components: {
      Output
    },
    props: {
      inputString: {
        type: String,
        required: true
      },
      inputFile: {
        type: Object,
        required: true
      },
      useFile: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        error: '',
        intArray: null
      };
    },
    watch: {
      inputString: {
        immediate: true,
        handler: async function (value) {
          try {
            this.error = '';

            if (!regEx.test(this.inputString)) {
              throw new Error('Invalid Base64 data');
            }

            this.intArray = this.toIntArray(Base64.atob(this.inputString));
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    methods: {
      toIntArray (str) {
        return Uint8Array.from(str, c => c.charCodeAt(0));
      }
    },
    canParse (str) {
      return regEx.test(str);
    }
  }
</script>
