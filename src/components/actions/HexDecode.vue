<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      Invalid hex data
    </NoteBlock>
    <NoteBlock warning v-else-if="loading">
      Loading...
    </NoteBlock>
    <template v-else>
      <md-card v-if="isImage" style="float: left">
        <md-card-header>
          <div class="md-title">Decoded Image</div>
          <div class="md-subhead">{{ imageWidth }}px &times; {{ imageHeight }}px</div>
        </md-card-header>

        <md-card-content>
          <img :src="asDataSrc"/>
        </md-card-content>

        <md-card-actions>
          <md-button :href="asDataSrc" download class="md-primary md-raised">Download</md-button>
        </md-card-actions>
      </md-card>
      <md-card v-else-if="isText">
        <md-card-header>
          <div class="md-title">Output</div>
        </md-card-header>

        <md-card-content>
          <md-field>
            <md-textarea v-model="asText" readonly/>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary md-raised" @click="copy(asText)">Copy</md-button>
        </md-card-actions>
      </md-card>
      <a download :href="asDataSrc.replace(/image\/jpeg/, 'application/octet-stream')" v-else>Download binary file</a>
      <div style="clear: both;">xxx-<!--TODO--></div>
    </template>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import { read } from 'fs';
  import { copy, getFileInfo } from '../../helpers';

  const hexRegEx = /^[A-Fa-f0-9+/\s]+$/

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
        loading: false,
        isImage: false,
        imageWidth: null,
        imageHeight: null,
        isText: true,
        asDataSrc: '',
        asText: '',
        error: false
      };
    },
    watch: {
      inputString: {
        immediate: true,
        handler: async function (value) {
          this.loading = true;
          this.error = false;
          this.isImage = false;
          this.isText = false;
          this.asDataSrc = '';
          this.asText = '';

          if (!hexRegEx.test(this.inputString)) {
            this.loading = false;
            this.error = true;

            return;
          }

          const result = await getFileInfo(this.toIntArray(value));

          this.loading = false;
          this.isImage = result.isImage;
          this.imageWidth = result.imageWidth;
          this.imageHeight = result.imageHeight;
          this.isText = result.isText;
          this.asDataSrc = result.asDataSrc;
          this.asText = result.asText;
        }
      }
    },
    methods: {
      copy,
      toIntArray (str) {
        const hexBytes = str.match(/[A-Fa-f0-9]{1,2}/g);
        const arrayBuffer = new ArrayBuffer(hexBytes.length);
        const intArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < hexBytes.length; i++) {
          intArray[i] = parseInt(hexBytes[i], 16);
        }

        return intArray;
      }
    },
    canParse (str) {
      return hexRegEx.test(str);
    }
  }
</script>
