<template>
  <div>
    <pre>{{ outputString }}</pre>
    <Copy :text="outputString"/>
  </div>
</template>

<script>
// TODO options

export default {
  name: 'UrlDecode',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    outputString: function () {
      try {
        return decodeURIComponent(this.inputString)
      } catch (e) {
        return 'Invalid data';
      }
    },
  },
  canParse (str) {
    return false; // TODO
  }
}
</script>

<style scoped lang="css">

</style>