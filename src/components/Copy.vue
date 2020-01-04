<template>
  <md-button class="md-icon-button md-dense" @click="copy(text)" title="Copy to clipboard">
    <md-icon>content_copy</md-icon>
  </md-button>
  <!-- todo visual feeback -->
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
  .md-icon-button {
    vertical-align: middle;
  }
</style>
