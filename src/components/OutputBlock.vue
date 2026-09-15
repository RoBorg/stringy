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
      <div class="card" v-if="isImage">
        <div class="card-header">
          <div class="card-title">Decoded Image</div>
          <div class="card-subhead">{{ imageWidth }}px &times; {{ imageHeight }}px</div>
        </div>

        <div class="card-content">
          <img :src="asDataSrc"/>
        </div>

        <div class="card-actions">
          <a :href="asDataSrc" download class="btn btn-primary">Download</a>
        </div>
      </div>
      <template v-else-if="isText">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Output</div>
          </div>

          <div class="card-content">
            <div class="field">
              <textarea v-model="asText" readonly/>
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="btn btn-primary" @click="copy(asText)">Copy</button>
          </div>
        </div>
        <div class="card" v-if="isHtml">
          <div class="card-header">
            <div class="card-title">HTML Preview</div>
          </div>

          <div class="card-content">
            <label>
              <input type="checkbox" v-model="sandbox">
              Sandbox preview (disallow Javascript etc)
            </label>
          </div>

          <div class="card-content">
            <iframe :srcdoc="asText" :sandbox="sandbox ? '' : false" class="preview"/>
          </div>
        </div>
      </template>
      <template v-else>
        <a class="btn btn-primary" download :href="asDataSrc.replace(/image\/jpeg/, 'application/octet-stream')">
          Download binary file
        </a>
        <p>
          {{ intArray.length.toLocaleString() }} bytes
        </p>
      </template>
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
      sandbox () {
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
