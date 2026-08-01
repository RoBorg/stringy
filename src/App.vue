<template>
  <div class="page-container" @drop.prevent="dropFiles" @dragover.prevent @dragenter="showOverlay = true">
    <header class="toolbar">
      <span class="toolbar-title">Stringy</span>
      <a class="btn-icon" href="https://github.com/RoBorg/stringy" target="_blank">
        <div class="github-icon"/>
      </a>
    </header>
    <main class="content">
      <p>
        <button class="btn" style="vertical-align: middle;" @click="paste">
          Paste
        </button>
         your text below, drag-drop a file or
        <button class="btn" style="vertical-align: middle;" @click="$refs.fileInput.click();">
          upload a file
        </button>
        <input type="file" @change="selectFile" ref="fileInput">
      </p>
      <StringyTool ref="stringy"/>
    </main>
    <transition name="fade">
      <div class="overlay" v-if="showOverlay" @dragleave="showOverlay = false" @dragenter="showOverlay = true">
        <div class="card drop-card">
          <div class="card-header">
            <div class="card-title">Drop File</div>
          </div>

          <div class="card-content">
            <p>Drop your file here</p>
          </div>
        </div>
      </div>
    </transition>
    <div class="snackbar" v-if="showUploadError">
      <span>Please choose a single file only</span>
      <button class="btn" @click="showUploadError = false">close</button>
    </div>
  </div>
</template>

<script>
  import StringyTool from './components/StringyTool.vue';
  import { mapActions, mapMutations } from 'vuex';

  import './css/data-table.css';

  export default {
    name: 'app',
    components: {
      StringyTool
    },
    data () {
      return {
        showOverlay: false,
        showUploadError: false,
        file: null
      };
    },
    methods: {
      ...mapActions(['setFile']),
      ...mapMutations(['removeFile']),
      selectFile (e) {
        const files = e.target.files || e.dataTransfer.files;

        if (files.length) {
          this.setFile(files[0]);
        } else {
          this.removeFile();
        }
      },
      dropFiles (e) {
        const files = e.target.files || e.dataTransfer.files;

        this.showOverlay = false;

        if (!files || !files.length) {
          this.removeFile();

          return;
        }

        if (files.length > 1) {
          this.showUploadError = true;
          this.removeFile();

          return;
        }

        this.setFile(files[0]);
      },
      paste () {
        this.$refs.stringy.paste();
      }
    }
  }
</script>

<style scoped>
  .github-icon {
    width: 32px;
    height: 32px;
    background-image: url(assets/github-light.png);
  }

  .overlay {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .overlay * {
    pointer-events: none;
  }

  .drop-card {
    margin: auto;
    width: 80%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .25s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  input[type=file] {
    display: none;
  }
</style>
