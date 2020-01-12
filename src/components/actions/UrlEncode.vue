<template>
  <div>
    <pre>{{ outputString }}</pre>
    <Copy :text="outputString"/>
  </div>
</template>

<script>
  // TODO options

  export default {
    name: 'UrlEncode',
    props: {
      inputString: {
        type: String,
        required: true
      }
    },
    computed: {
      outputString: function () {
        return encodeURIComponent(this.inputString);
      },
    },
    canParse () {
      return false;
    }
  }
</script>

<style scoped lang="css">
  tbody th {
    text-align: right;
  }

  table.data {
    border-collapse: collapse;
  }

  table.data th,
  table.data td {
    background-color: #ffffff;
    border-top: 1px solid #dddddd;
    padding: 8px 10px;
    transition: background-color 0.5s;
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

  .parameters {
    width: 100%;
  }
</style>