<template>
  <div>
    <textarea v-model="outputString"/>
  </div>
</template>

<script>
// TODO options

export default {
  name: 'JsonDecode',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    outputString: function () {
      // TODO show errors better
      let json;

      try {
        json = JSON.parse(this.inputString)
      } catch (e) {
        return e.message;
      }

      return JSON.stringify(json, null, 4);
    }
  },
  canParse (str) {
    let json;

    try {
      json = JSON.parse(str);
    } catch (e) {
      // Do nothing
    }

    return typeof json !== 'undefined';
  }
}
</script>
