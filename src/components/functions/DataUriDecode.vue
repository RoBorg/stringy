<template>
  <div>
    <md-card v-if="isImage" style="float: left">
      <md-card-header>
        <div class="md-title">Decoded Image</div>
        <div class="md-subhead">{{ imageWidth }}px &times; {{ imageHeight }}px</div>
      </md-card-header>

      <md-card-content>
        <img :src="inputString"/>
      </md-card-content>

      <md-card-actions>
        <md-button :href="inputString" download class="md-raised md-primary">Download</md-button>
      </md-card-actions>
    </md-card>
    <md-card v-else-if="isText">
      <md-card-header>
        <div class="md-title">Decoded Text</div>
      </md-card-header>

      <md-card-content>
        <textarea class="output" v-model="asText" readonly/>
      </md-card-content>

      <md-card-actions>
        <md-button>TODOCopy</md-button>
      </md-card-actions>
    </md-card>
    <md-button download :href="inputString" v-else>Download binary file</md-button>
    <div style="clear: both;">xxx</div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import { imageInfo } from '../../helpers';

// TODO options

const regEx = /^data:([^,]*?)(base64|),(.*)$/si;

export default {
  name: 'DataUriDecode',
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
      asText: ''
    };
  },
  watch: {
    inputString: {
      immediate: true,
      handler: async function (value) {
        const matches = this.inputString.match(regEx);

        let data = matches[3];
        if (matches[2] !== '') {
          data = Base64.decode(data);
        } else {
          try {
            data = decodeURIComponent(data);
          } catch (e) {
            data = 'Invalid URL-encoded data';
          }
        }

        // this.dataSrc = '';
        this.asText = data;

        const imageInfoResult = await imageInfo(value);
        this.isImage = imageInfoResult.isImage;
        this.imageWidth = imageInfoResult.width;
        this.imageHeight = imageInfoResult.height;

        for (let i = 0; i < data.length; i++) {
          const byte = data[i];

          if (byte < 32) {
            this.isText = false;
          }
        }
      }
    }
  },
  canParse (str) {
    return regEx.test(str);
  }
}
</script>

<style scoped lang="css">

</style>