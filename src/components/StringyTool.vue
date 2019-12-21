<template>
  <div>

aGVsbG8gd29ybGQ=
<br><br>
{"fruit": "Apple","size": "Large","color": "Red"}
<br><br>
https://www.amazon.co.uk/dp/B07TWFWJDZ/ref=gw_uk_desk_mso_dc_avs_fb2?pf_rd_p=a2b298ad-045f-44eb-9b21-44e5da2e38ed&pf_rd_r=HZ8KBA6Y40P1CKVN6T1J#1231
<br><br>
1576923482
<br><br>

    <textarea v-model="inputString" class="input"/>
    {{ characterCount }} characters, {{ wordCount }} words, {{ lineCount }} lines
  TODO input info
  length, words, charset

    <select v-model="selectedFunction" class="select-function">
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
import UnixTimestamp from './UnixTimestamp';
import Unknown from './Unknown';
import UrlDecode from './UrlDecode';

const functions = {
  'Base 64 Encode': Base64Encode,
  'Base 64 Decode': Base64Decode,
  'JSON Decode': JsonDecode,
  'Unknown': Unknown,
  'Unix Timestamp': UnixTimestamp,
  'URL Decode': UrlDecode
};

export default {
  name: 'StringyTool',
  components: {
    Base64Decode,
    Base64Encode,
    JsonDecode,
    Unknown,
    UnixTimestamp,
    UrlDecode
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
    outputString: function () {
      return this.inputString;
    },
    currentComponent: function () {
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

      const str = this.inputString.trim();

      if (str === '') {
        return Unknown;
      }

      for (const f in functions) {
        if (functions[f].canParse(str)) {
          return functions[f];
        }
      }

      return Unknown;
    },
    characterCount: function () {
      return this.inputString.length;
    },
    wordCount: function () {
      return this.inputString.length;
    },
    lineCount: function () {
      return (this.inputString.match(/\r\n|\r|\n/g) || []).length + 1;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.input {
  width: 100%;
  height: 200px;
}

.select-function {

}

/deep/ .output {
  width: 100%;
  height: 200px;
}

</style>
