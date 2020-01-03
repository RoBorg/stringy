<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Stringy</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" :md-active.sync="showNavigation" md-swipeable>
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <p>Paste your text below, drag-drop a file or <a href="#todo">upload a file</a></p>
        <StringyTool/>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="css" scoped>
  .md-app {
    border: 1px solid rgba(#000, .12);
  }

    /* Demo purposes only */
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>

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
        showNavigation: false
      };
    }
  }
</script>


<style>
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