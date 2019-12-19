<template>
  <div>

aGVsbG8gd29ybGQ=
<br><br>
{"fruit": "Apple","size": "Large","color": "Red"}
<br><br>

    <textarea v-model="inputString"/>
  TODO input info
  length, words, charset

    <select v-model="selectedFunction">
      <option :value="null">
        Auto
        <template v-if="autoFunction">
          {{ functions[autoFunction] }}
        </template>
      </option>
      todo: swap button, copy button
      <option v-for="(value, name) in functions" :key="value.name" :value="name">
        {{ name }}
      </option>
    </select>
    <component v-bind:is="currentComponent" :inputString="inputString"></component>
  </div>
</template>

<script>
import Base64Encode from './Base64Encode';
import Base64Decode from './Base64Decode';
import JsonDecode from './JsonDecode';
import Unknown from './Unknown';

const functions = {
  'Base 64 Encode': Base64Encode,
  'Base 64 Decode': Base64Decode,
  'JSON Decode': JsonDecode,
  'Unknown': Unknown
};

export default {
  name: 'HelloWorld',
  components: {
    Base64Decode,
    Base64Encode,
    JsonDecode,
    Unknown
  },
  data() {
    return {
      inputString: 'aGVsbG8gd29ybGQ=',
      stringType: null,
      selectedFunction: null,
      autoFunction: null, // TODO
      functions
    };
  },
  computed: {
    outputString: function() {
      return this.inputString;
    },
    currentComponent: function() {
      if (this.selectedFunction) {
        return functions[this.selectedFunction];
      }

      /*
      TODO
      https://codebeautify.org/string-functions

      Data URI
      Base64
      Base64 image
      URL
      XML formatter/validator
      (S)CSS
      SQL
      HTML format
      html en/decode
      unix timestamp
      gzip
      hex (md5? sha? colour?)
      csv
      ssh key
      ssl cert
      CIDR
      QR code generator
      */

      for (const f in functions) {
        if (functions[f].canParse(this.inputString)) {
          return functions[f];
        }
      }

      return Unknown;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
