<template>
  <div id="app">
    <StringyTool/>
  </div>
</template>

<script>
import StringyTool from './components/StringyTool.vue'

export default {
  name: 'app',
  components: {
    StringyTool
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
