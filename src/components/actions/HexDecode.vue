<template>
  <div>
    <NoteBlock alert v-if="error">
      Error: {{ error }}
    </NoteBlock>
    <Output v-else :int-array="intArray"/>
  </div>
</template>

<script>
  import action from './action.mixin';

  const hexRegEx = /^[A-Fa-f0-9\s]+$/

  export default {
    name: 'HexDecode',
    mixins: [action],
    data () {
      return {
        error: '',
        intArray: null
      };
    },
    watch: {
      inputString: {
        immediate: true,
        handler (value) {
          try {
            this.error = '';

            if ((this.inputString !== '') && !hexRegEx.test(this.inputString)) {
              throw new Error('Invalid hex data');
            }

            this.intArray = this.toIntArray(this.inputString);
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    methods: {
      toIntArray (str) {
        const hexBytes = str.match(/[A-Fa-f0-9]{1,2}/g) || [];
        const arrayBuffer = new ArrayBuffer(hexBytes.length);
        const intArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < hexBytes.length; i++) {
          intArray[i] = parseInt(hexBytes[i], 16);
        }

        return intArray;
      }
    },
    canParse (str) {
      return hexRegEx.test(str);
    }
  }
</script>
