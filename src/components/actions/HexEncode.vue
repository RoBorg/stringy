<template>
  <div>
    <textarea v-model="outputString" class="output" readonly/>
      <md-checkbox v-model="format">Format output</md-checkbox>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';

  // TODO options, binary decode

  export default {
    name: 'HexEncode',
    props: {
      inputString: {
        type: String,
        required: true
      },
      inputArrayBuffer: {
        type: ArrayBuffer,
        required: false
      }
    },
    data() {
      return {
        format: false
      };
    },
    computed: {
      outputString: function () {
        let result;

        if (this.inputArrayBuffer) {
          result = [...new Uint8Array(this.inputArrayBuffer)];
        } else {
          result = [...new TextEncoder().encode(this.inputString)];
        }

        result = result.map(b => b.toString(16).padStart(2, '0'));
        console.log(result)

        if (this.format) {
          return result.reduce((accumulator, currentValue, index) => {
            const newLine = index % 16 ? '' : '\n';
            const space = index % 2 ? '' : ' ';
            const divider = newLine ? newLine : space;

            return accumulator + divider + currentValue;
          });
        }

        return result.join('');
      }
    },
    canParse () {
      return false;
    }
  }
</script>
