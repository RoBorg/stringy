<template>
  <div id="app">
    <div class="logo">Stringy</div>
    <p class="description">
      Paste your text below, drag-drop a file or <a href="#todo">upload a file</a>
    </p>
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
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: Consolas, 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

table.data {
  border-collapse: collapse;
}

table.data tbody th {
  text-align: right;
}

table.data th,
table.data td {
  background-color: #ffffff;
  border-top: 1px solid #dddddd;
  padding: 8px 10px;
}

table.data td {
  font-family: 'Courier New', Courier, monospace;
}

table.data > tbody > tr:nth-child(even) > td {
  background-color: #f9f9f9;
}

table.data > tbody > tr:nth-child(even) > th {
  background-color: #f1f1f1;
}

table.data > tbody > tr:hover > th {
  background-color: #eaeaea;
}

table.data > tbody > tr:hover > td {
  background-color: #f6f6f6;
}

table.data > tbody > tr:first-child > th,
table.data > tbody > tr:first-child > td {
  border-top-width: 0;
}
</style>
