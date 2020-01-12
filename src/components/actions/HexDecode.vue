<template>
  <div>
    <md-card v-if="isImage" style="float: left">
      <md-card-header>
        <div class="md-title">Decoded Image</div>
        <div class="md-subhead">{{ imageWidth }}px &times; {{ imageHeight }}px</div>
      </md-card-header>

      <md-card-content>
        <img :src="dataSrc"/>
      </md-card-content>

      <md-card-actions>
        <md-button :href="dataSrc" download class="md-primary md-raised">Download</md-button>
      </md-card-actions>
    </md-card>
    <md-card v-else-if="isText">
      <md-card-header>
        <div class="md-title">Card without hover effect</div>
      </md-card-header>

      <md-card-content>
        <textarea class="output" v-model="asText" readonly/>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-primary md-raised">TODOCopy</md-button>
      </md-card-actions>
    </md-card>
    <a download :href="dataSrc.replace(/image\/jpeg/, 'application/octet-stream')" v-else>Download binary file</a>
    <div style="clear: both;">xxx</div>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import { read } from 'fs';
  import { imageInfo } from '../../helpers';

  // TODO options, binary decode

  export default {
    name: 'HexDecode',
    props: {
      inputString: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        isImage: false,
        imageWidth: null,
        imageHeight: null,
        isText: true,
        dataSrc: '',
        asText: ''
      };
    },
    watch: {
      inputString: {
        immediate: true,
        handler: async function (value) {
          const reader = new FileReader();

          this.isImage = false;
          this.dataSrc = '';
          this.asText = '';

          reader.onloadend = await async () => {
            this.dataSrc = reader.result;

            const imageInfoResult = await imageInfo(this.dataSrc);
            this.isImage = imageInfoResult.isImage;
            this.imageWidth = imageInfoResult.width;
            this.imageHeight = imageInfoResult.height;

            if (!this.isImage) {
              this.asText = Base64.decode(reader.result.replace(/^.+?,/, ''));
            }
          };

          reader.readAsDataURL(this.toBinary(value));
        }
      }
    },
    methods: {
      toBinary (str) {
        const hexBytes = str.match(/[A-Fa-f0-9]{1,2}/g);
        const arrayBuffer = new ArrayBuffer(hexBytes.length);
        const intArray = new Uint8Array(arrayBuffer);

        this.isText = true;

        for (let i = 0; i < hexBytes.length; i++) {
          const byte = parseInt(hexBytes[i], 16);
          intArray[i] = byte;

          if (byte < 32) {
            this.isText = false;
          }
        }

        // Doesn't matter if the image isn't actually a jpeg
        return new Blob([intArray], {type: "image/jpeg"});
      },
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
      // btoaUTF16 (sString) {
      //   const aUTF16CodeUnits = new Uint16Array(sString.length);

      //   Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) {
      //     arr[idx] = sString.charCodeAt(idx);
      //   });

      //   return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));

      // },
      // atobUTF16 (sBase64) {
      //   const sBinaryString = atob(sBase64);
      //   const aBinaryView = new Uint8Array(sBinaryString.length);

      //   Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) {
      //     arr[idx] = sBinaryString.charCodeAt(idx);
      //   });

      //   return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer));
      // }
    },
    canParse (str) {
      return /^[A-Fa-f0-9+/\s]+$/.test(str);
    }
  }
</script>
