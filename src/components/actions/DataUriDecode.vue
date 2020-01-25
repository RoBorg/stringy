<template>
  <div>
    <NoteBlock alert v-if="error">
      Error: {{ error }}
    </NoteBlock>
    <Output v-else :int-array="intArray"/>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import Output from '../Output';

  const regEx = /^data:([^,]*?)(base64|),(.*)$/si;

  export default {
    name: 'DataUriDecode',
    components: {
      Output
    },
    props: {
      inputString: {
        type: String,
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
        handler: function (value) {
          try {
            const matches = this.inputString.match(regEx);
            let data;

            this.error = '';

            if (!matches) {
              throw new Error('Invalid data URI');
            }

            data = matches[3];

            if (matches[2] !== '') {
              data = Base64.atob(data);
            } else {
              data = decodeURIComponent(data);
            }

            this.intArray = this.toIntArray(data);
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    methods: {
      toIntArray (str) {
        return Uint8Array.from(str, c => c.charCodeAt(0));
        // const arrayBuffer = new ArrayBuffer(str.length);
        // const intArray = new Uint8Array(arrayBuffer);

        // for (let i = 0; i < str.length; i++) {
        //   intArray[i] = str.charCodeAt(i);
        // }

        // return intArray;
      }
    },
    canParse (str) {
      return regEx.test(str);
    }
  }
</script>

<style scoped lang="css">
  .preview {
    border: 0;
    width: 100%;
    height: 500px;
  }
</style>