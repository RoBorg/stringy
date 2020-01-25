<template>
  <div>
    <NoteBlock alert v-if="error">
      Error: {{ error }}
    </NoteBlock>
    <Output v-else :int-array="intArray"/>
  </div>
</template>

<script>
  import Output from '../Output';

  const decode = (str) => {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      // TODO binary somehow
      throw new Error('Invalid data: ' + e.message);
    }
  };

  export default {
    name: 'UrlDecode',
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
    computed: {
      outputString: function () {
        try {
          return this.decode(this.inputString);
        } catch (e) {
          return 'Invalid data: ' + e.message;
        }
      },
    },
    watch: {
      inputString: {
        immediate: true,
        handler: function (value) {
          this.error = '';

          try {
            const data = this.decode(this.inputString);

            this.intArray = this.toIntArray(data);
          } catch (e) {
            this.error = e.message;
          }
        }
      }
    },
    methods: {
      decode,
      toIntArray (str) {
        return Uint8Array.from(str, c => c.charCodeAt(0));
      }
    },
    canParse (str) {
      if (!/%/.test(str)) {
        return false;
      }

      try {
        decode(str);

        return true;
      } catch (e) {
        return false;
      }
    }
  }
</script>
