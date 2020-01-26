<template>
  <div>
    <NoteBlock warning v-if="(intArray === null) || !intArray.length">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      Error: {{ error }}
    </NoteBlock>
    <NoteBlock warning v-else-if="loading">
      Loading...
    </NoteBlock>
    <template v-else>
      <md-card v-if="isImage">
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
      <template v-else-if="isText">
        <md-card>
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
      <a download :href="asDataSrc.replace(/image\/jpeg/, 'application/octet-stream')" v-else>
        Download binary file
      </a>
    </template>
  </div>
</template>

<script>
  import { copy, getFileInfo } from '../helpers';

  export default {
    name: 'Output',
    props: {
      intArray: {
        type: Uint8Array,
        required: false
      }
    },
    data () {
      return {
        loading: false,
        isHtml: false,
        isImage: false,
        imageWidth: null,
        imageHeight: null,
        isText: true,
        asDataSrc: '',
        asText: '',
        error: false,
        sandbox: true
      };
    },
    watch: {
      sandbox: function () {
        const temp = this.asText;
        this.asText = '';

        this.$nextTick(() => this.asText = temp);
      },
      intArray: {
        immediate: true,
        handler: async function (value) {
          this.loading = true;
          this.error = false;
          this.isImage = false;
          this.isText = false;
          this.asDataSrc = '';
          this.asText = '';

          try {
            const result = await getFileInfo(value);

            this.isHtml = result.isHtml;
            this.isImage = result.isImage;
            this.imageWidth = result.imageWidth;
            this.imageHeight = result.imageHeight;
            this.isText = result.isText;
            this.asDataSrc = result.asDataSrc;
            this.asText = result.asText;
          } catch (e) {
            this.error = e.message;
          } finally {
            this.loading = false;
          }
        }
      }
    },
    methods: {
      copy
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
