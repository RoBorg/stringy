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

  export default {
    name: 'CSlashesDecode',
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
            const uuid = '----STRINGY DOUBLE SLASH----';
            const escapes = {
              '\\a': '\u0007',
              '\\b': '\b',
              '\\e': '\u001B',
              '\\f': '\f',
              '\\n': '\n',
              '\\r': '\r',
              '\\t': '\t',
              '\\v': '\v'
            };

            // Replace escaped backslashes
            let str = value.replace('\\\\', uuid);

            // Replace octal escapes
            str = str.replace(/\\[0-7]{1,3}/g, c => String.fromCharCode(parseInt(c.substring(1), 8)));

            // Replace hex escapes
            str = str.replace(/\\x[\dA-Fa-f]+/g, c => String.fromCharCode(parseInt(c.substring(2), 16)));

            // Replace 4-digit unicode escapes
            str = str.replace(/\\u[\dA-Fa-f]{4}/g, c => JSON.parse(`"${c}"`).replace(/^"|"$/g, ''));

            // Replace normal characters
            str = str.replace(/\\./g, c => escapes[c] || c.charAt(1));

            str = str.replace(uuid, '\\');

            this.intArray = encoder.encode(str);
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    canParse (str) {
      return /\\[btnfr'"\\xu0-7]/.test(str);
    }
  }
</script>
