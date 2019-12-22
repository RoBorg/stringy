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
e2988020e2988120e2988220e2988320e2988420e2988520e2988620e2988720e2988820e2988920e2988a20e2988b20e2988c20e2988d20e2988e20e2988f20e2989020e2989120e2989220e2989320e2989620e2989720e2989920e2989a20e2989b20e2989c20e2989d

    <textarea v-model="inputString" class="input"/>
    {{ characterCount }} characters, {{ wordCount }} words, {{ lineCount }} lines

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
import HexEncode from './HexEncode';
import HexDecode from './HexDecode';
import JsonDecode from './JsonDecode';
import SqlFormat from './SqlFormat';
import UnixTimestamp from './UnixTimestamp';
import Unknown from './Unknown';
import UrlDecode from './UrlDecode';

const functions = {
  'Base 64 Encode': Base64Encode,
  'Base 64 Decode': Base64Decode,
  'Hex Encode': HexEncode,
  'Hex Decode': HexDecode,
  'JSON Decode': JsonDecode,
  'SqlFormat': SqlFormat,
  'Unknown': Unknown,
  'Unix Timestamp': UnixTimestamp,
  'URL Decode': UrlDecode
};

export default {
  name: 'StringyTool',
  components: {
    Base64Decode,
    Base64Encode,
    HexDecode,
    HexEncode,
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
      return this.inputString.split(/\s+/).length;
    },
    lineCount: function () {
      return (this.inputString.match(/\r\n|\r|\n/g) || []).length + 1;
    }
  }
}
</script>

<style scoped lang="css">

.input {
  width: 100%;
  height: 200px;
}

.select-function {
  border: 1px solid red;
}

::v-deep .output {
  width: 100%;
  height: 200px;
}

</style>
