<template>
  <div>
    <pre>{{ outputString }}</pre>
    <Copy :text="outputString"/>
    <img :src="inputString" v-if="isImage"/>
  </div>
</template>

<script>
// TODO options

export default {
  name: 'DataUriDecode',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isImage: false
    };
  },
  computed: {
    outputString: function () {
      const matches = this.inputString.match(/^data:([^,]+?)(base64|),(.*)$/);
      let data = matches[3];
      console.log(matches)
      if (matches[2] === 'base64') {
        // todo
      } else {
        try {
          data = decodeURIComponent(data);
        } catch (e) {
          data = 'Invalid URL-encoded data';
        }
      }

      return data;
    },
  },
  watch: {
    inputString: {
      immediate: true,
      handler: function (value) {
        const image = new Image();

        this.isImage = false;
        this.dataSrc = '';
        this.asText = '';

        image.onload = () => this.isImage = true;
        image.onerror = () => {
        };
        image.src = value;
      }
    }
  },
  canParse (str) {
    return /^data:/.test(str);
  }
}
</script>

<style scoped lang="css">

</style>