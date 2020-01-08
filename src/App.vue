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
        <p>Paste your text below, drag-drop a file or
          <md-button style="vertical-align: middle" class="md-raised">
            <label>
              upload a file
              <input type="file" @change="selectFile">
            </label>
          </md-button>
        </p>
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
    <div @click="$store.commit('increment')">{{count}}</div>
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
        file: null
      };
    },
    computed: {
      count () {
        return this.$store.state.count
      }
    },
    methods: {
      log(a) {console.log(a)}, // todo delete
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
          // TODO
          alert('one file only please');

          this.removeFile();

          return;
        }

        this.setFile(files[0]);
      },
      // setFile (file) {
      //   this.file = file;
      //   this.loadFile();
      // },
      // removeFile () {
      //   this.file = null;
      // },
      loadFile () {
        const reader = new FileReader();

        if (!this.file)
          return;

        reader.onload = function(e) {
          console.log(e.target.result); // TODO
        };

        reader.readAsDataURL(this.file);
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
