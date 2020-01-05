<template>
  <div>
TODO file upload
    <TestData/>
    <md-field>
      <md-textarea v-model="inputString" placeholder="Enter your text here"/>
    </md-field>

    <div class="input-info">
      <span class="amount">{{ characterCount }}</span> character<template v-if="characterCount != 1">s</template>,
      <span class="amount">{{ wordCount }}</span> word<template v-if="wordCount != 1">s</template>,
      <span class="amount">{{ lineCount }}</span> line<template v-if="lineCount != 1">s</template>
    </div>
    <select v-model="selectedFunction" class="select-function">
      <option :value="null">
        Auto ({{ autoFunction.name }})
      </option>
      <option v-for="option in functionOptions" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <component v-bind:is="currentComponent" :inputString="inputString"/>
  </div>
</template>

<script>
import Base64Encode from './functions/Base64Encode';
import Base64Decode from './functions/Base64Decode';
import CssColour from './functions/CssColour';
import Copy from './Copy';
import DataUriDecode from './functions/DataUriDecode';
import HexEncode from './functions/HexEncode';
import HexDecode from './functions/HexDecode';
import IpAddress from './functions/IpAddress';
import JsonDecode from './functions/JsonDecode';
import SqlFormat from './functions/SqlFormat';
import SslCertificate from './functions/SslCertificate';
import UnixTimestamp from './functions/UnixTimestamp';
import Unknown from './functions/Unknown';
import Url from './functions/Url';
import UrlDecode from './functions/UrlDecode';
import UrlEncode from './functions/UrlEncode';
import XmlFormat from './functions/XmlFormat';
import TestData from './TestData';

const unknown = {
  name: 'Unknown',
  component: Unknown
};
    /*
    TODO
    https://codebeautify.org/string-functions

    Data URI
    Base64
    Base64 image
    URL
    XML format/validator/decode
    (S)CSS
    SQL
    HTML format
    html en/decode
    hex (md5? sha? colour?)
    ssh key (format conversion, public from private)
    ssl cert https://www.npmjs.com/package/openssl.js
    */

// Functions, in order of most specific first
// E.g. Base 64 Decode will match a unix timestamp, so make sure
// Unix Timestamp comes before it
const functions = [
  {
    name: 'SSL Certificate',
    component: SslCertificate
  },
  {
    name: 'CSS Colour',
    component: CssColour
  },
  {
    name: 'Data URI Decode',
    component: DataUriDecode
  },
  {
    name: 'Unix Timestamp',
    component: UnixTimestamp
  },
  {
    name: 'IP Address',
    component: IpAddress
  },
  {
    name: 'Hex Decode',
    component: HexDecode
  },
  {
    name: 'Hex Encode',
    component: HexEncode
  },
  {
    name: 'Base 64 Decode',
    component: Base64Decode
  },
  {
    name: 'Base 64 Encode',
    component: Base64Encode
  },
  {
    name: 'JSON Decode',
    component: JsonDecode
  },
  {
    name: 'SQL Format',
    component: SqlFormat
  },
  {
    name: 'URL Information',
    component: Url
  },
  {
    name: 'URL Decode',
    component: UrlDecode
  },
  {
    name: 'URL Encode',
    component: UrlEncode
  },
  {
    name: 'XML Format',
    component: XmlFormat
  },
  unknown
];

const components = {Copy: Copy, TestData: TestData};

functions.map((f) => components[f.component.name] = f.component);

export default {
  name: 'StringyTool',
  components,
  data() {
    return {
      inputString: 'aGVsbG8gd29ybGQ=',
      stringType: null,
      selectedFunction: null,
      functions
    };
  },
  computed: {
    outputString: function () {
      return this.inputString;
    },
    currentComponent: function () {
      if (this.selectedFunction) {
        return functions[this.selectedFunction].component;
      }

      return this.autoFunction.component;
    },
    autoFunction: function () {
     const str = this.inputString.trim();

      if (str === '') {
        return unknown;
      }

      for (const f in functions) {
        if (functions[f].component.canParse(str)) {
          return functions[f];
        }
      }

      return unknown;
    },
    characterCount: function () {
      return this.inputString.length;
    },
    wordCount: function () {
      return this.inputString.split(/\s+/).length;
    },
    lineCount: function () {
      return (this.inputString.match(/\r\n|\r|\n/g) || []).length + 1;
    },
    functionOptions: function () {
      const options = [];

      for (let i in this.functions) {
        options.push({
          value: i,
          text: this.functions[i].name
        });
      }

      options.sort((a, b) => a.text.localeCompare(b.text));

      return options;
    }
  }
}
</script>

<style scoped lang="css">

.input {
  width: 100%;
  height: 200px;
}

.input-info {
  background-color: #fefefe;
}

.input-info .amount {
  font-weight: bold;
}

.select-function {
  border: 1px solid red;
}

::v-deep .output {
  width: 100%;
  height: 200px;
}

</style>
