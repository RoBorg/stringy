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
  import { urlEncodedToUint8Array } from '../../helpers';

  export default {
    name: 'UrlDecode',
    mixins: [action],
    data () {
      return {
        error: '',
        intArray: null
      };
    },
    watch: {
      text: {
        immediate: true,
        handler (value) {
          this.error = '';

          try {
            this.intArray = urlEncodedToUint8Array(value);
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    canParse (str) {
      if (!/%/.test(str)) {
        return false;
      }

      try {
        urlEncodedToUint8Array(str);

        return true;
      } catch (e) {
        return false;
      }
    }
  }
</script>
