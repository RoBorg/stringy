<template>
  <div class="page-container" @drop.prevent="addFile" @dragover.prevent @dragenter="showOverlay = true">
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
        <p>Paste your text below, drag-drop a file or <a href="#todo">upload a file</a></p>
        <md-button @click="loadFile">Read File TOOD</md-button>
        <StringyTool/>
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
  </div>
</template>

<script>
  import StringyTool from './components/StringyTool.vue';

  import './css/data-table.css';

  export default {
    name: 'app',
    components: {
      StringyTool
    },
    data () {
      return {
        showOverlay: false,
        file: null
      };
    },
    methods: {
      log(a) {console.log(a)},
      addFile (e) {
        const droppedFiles = e.dataTransfer.files;
        const files = [];

        this.showOverlay = false;

        if (!droppedFiles) {
          return;
        }

        // Convert FileList to array https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
        ([...droppedFiles]).forEach(f => {
          files.push(f);
        });

        if (files.length > 1) {
          // TODO
          alert('one file only please');
          return;
        }

        this.file = files[0];
        console.log(this.file)
      },
      removeFile () {
        this.file = null;
      },
      loadFile () {
        // tODO
        const reader = new FileReader();
        const files = this.file ? [this.file] : this.$refs('#file')[0].files;

        if (!files.length)
          return;

        reader.onload = function(e) {
          console.log(e.target.result);
        };

        reader.readAsDataURL(files[0]);
      }
    },
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

/*
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif; * /
  font-family: Consolas, 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
*/
</style>
