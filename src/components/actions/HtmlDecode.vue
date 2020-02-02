<template>
  <div>
    <NoteBlock alert v-if="error">
      Error: {{ error }}
    </NoteBlock>
    <Output v-else :int-array="intArray"/>
  </div>
</template>

<script>
  import { decode } from 'he';
  import action from './action.mixin';

  export default {
    name: 'HtmlDecode',
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
          const encoder = new TextEncoder();
          this.error = '';

          try {
            this.intArray = encoder.encode(decode(value));
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    canParse (str) {
      return /&(amp|lt|gt|quot|#\d+|#x[a-f0-9]+)/.test(str);
    }
  }
</script>
