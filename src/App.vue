<template>
  <div class="page-container" @drop.prevent="dropFiles" @dragover.prevent @dragenter="showOverlay = true">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Stringy</span>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" href="https://github.com/RoBorg/stringy" target="_blank">
            <div class="github-icon"/>
          </md-button>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <p>
          <md-button style="vertical-align: middle;" class="md-raised" @click="paste">
            Paste
          </md-button>
           your text below, drag-drop a file or
          <md-button style="vertical-align: middle;" class="md-raised" @click="$refs.fileInput.click();">
            upload a file
          </md-button>
          <input type="file" @change="selectFile" ref="fileInput">
        </p>
        <StringyTool ref="stringy"/>
      </md-app-content>
    </md-app>
    <transition name="fade">
      <div class="overlay" v-if="showOverlay" @dragleave="showOverlay = false" @dragenter="showOverlay = true">
        <md-card class="drop-card">
          <md-card-header>
            <div class="md-title">Drop File</div>
          </md-card-header>

          <md-card-content>
            <p>Drop your file here</p>
          </md-card-content>
        </md-card>
      </div>
    </transition>
    <md-snackbar md-position="center" :md-active.sync="showUploadError">
      <span>Please choose a single file only</span>
      <md-button class="md-primary" @click="showUploadError = false">close</md-button>
    </md-snackbar>
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
