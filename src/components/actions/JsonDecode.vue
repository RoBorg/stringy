<template>
  <div>
    <Copy :text="outputString"/>
    <pre v-highlightjs="outputString"><code class="json"></code></pre>
    <Copy :text="outputString"/>
    <md-divider/>
    <md-field>
      <label>Indent with</label>
    </md-field>
    <md-radio v-model="indentType" value="spaces">
      <md-field class="spaces-field">
        <md-input v-model="indentSpaces" type="number" class="spaces-input"/>
        <span class="md-suffix">Spaces</span>
      </md-field>
    </md-radio>
    <md-radio v-model="indentType" value="tabs">Tabs</md-radio>
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
    data() {
      return {
        indentType: 'spaces',
        indentSpaces: 4
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

        return JSON.stringify(json, null, this.indentType === 'tabs' ? '\t' : parseInt(this.indentSpaces));
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

<style scoped>
  .spaces-field {
    vertical-align: middle;
    padding-top: 0;
    margin: 0;
    min-height: 20px;
    height: 20px;
    line-height: 20px;
  }

  .spaces-field .spaces-input {
    width: 2em;
    height: 20px;
  }
</style>
