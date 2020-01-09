<template>
  <div>
    <Copy :text="outputString"/>
    <pre v-highlightjs="outputString"><code class="json"></code></pre>
    <Copy :text="outputString"/>
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

    // Don't JSON-decode raw values, e.g. 123456
    if (!/{|\[/.test(str)) {
      return false;
    }

    try {
      json = JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  }
}
</script>
