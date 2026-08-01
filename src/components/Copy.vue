<template>
  <button type="button" class="btn-icon" @click="copy(text)" title="Copy to clipboard">
    <font-awesome-icon icon="copy"/>
  </button>
</template>

<script>
  import { copy } from '../helpers';

  export default {
    name: 'Copy',
    props: {
      text: {
        type: String,
        required: true
      }
    },
    methods: {
      copy
    }
  }
</script>

<style scoped>
  .btn-icon {
    vertical-align: middle;
  }
</style>
