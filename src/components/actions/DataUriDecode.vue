<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      Error decoding URI
    </NoteBlock>
    <template v-else>
      <md-card v-if="isImage" style="float: left">
        <md-card-header>
          <div class="md-title">Decoded Image</div>
          <div class="md-subhead">{{ imageWidth }}px &times; {{ imageHeight }}px</div>
        </md-card-header>

        <md-card-content>
          <img :src="inputString"/>
        </md-card-content>

        <md-card-actions>
          <md-button :href="inputString" download class="md-primary md-raised">Download</md-button>
        </md-card-actions>
      </md-card>
      <template v-else-if="isText">
        <md-card>
          <md-card-header>
            <div class="md-title">Decoded Text</div>
          </md-card-header>

          <md-card-content>
            <md-field>
              <md-textarea v-model="asText" placeholder="Enter your text here" readonly/>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-raised" :href="inputString" download>Download</md-button>
            <md-button class="md-primary md-raised" @click="copy(asText)">Copy</md-button>
          </md-card-actions>
        </md-card>

        <br><br>

        <md-card v-if="isHtml">
          <md-card-header>
            <div class="md-title">HTML Preview</div>
          </md-card-header>

          <md-card-content>
            <label>
              <input type="checkbox" v-model="sandbox">
              Sandbox preview (disallow Javascript etc)
            </label>
          </md-card-content>

          <md-card-content>
            <iframe :srcdoc="asText" :sandbox="sandbox ? '' : false" class="preview"/>
          </md-card-content>
        </md-card>
      </template>
      <md-button download :href="inputString" class="md-primary md-raised" v-else>Download binary file</md-button>
      <div style="clear: both;">xxx-<!--TODO--></div>
    </template>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import { imageInfo } from '../../helpers';
  import { copy } from '../../helpers';

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
        asText: '',
        isHtml: false,
        sandbox: true,
        error: false
      };
    },
    watch: {
      sandbox: function () {
        const temp = this.asText;
        this.asText = '';

        this.$nextTick(() => this.asText = temp);
      },
      inputString: {
        immediate: true,
        handler: async function (value) {
          const matches = this.inputString.match(regEx);
          let data;
          this.error = false;

          try {
            data = matches[3];

            if (matches[2] !== '') {
              data = Base64.decode(data);
            } else {
              data = decodeURIComponent(data);
            }
          } catch (e) {
            this.error = true;

            return;
          }

          this.isText = true;
          this.asText = data;
          this.isHtml = /<(html|head|title|body|div|span|a|p)/i.test(data);

          const imageInfoResult = await imageInfo(value);
          this.isImage = imageInfoResult.isImage;
          this.imageWidth = imageInfoResult.width;
          this.imageHeight = imageInfoResult.height;

          for (let i = 0; i < data.length; i++) {
            const byte = data.charCodeAt(i);

            if (byte < 32) {
              this.isText = false;
            }
          }
        }
      }
    },
    methods: {
      copy
    },
    canParse (str) {
      return regEx.test(str);
    }
  }
</script>

<style scoped lang="css">
  .preview {
    border: 0;
    width: 100%;
    height: 500px;
  }
</style>