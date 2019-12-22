<template>
  <span class="icon">
    <font-awesome-icon icon="copy" @click="copy(text)" title="Copy to clipboard"/>
  </span>
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

.icon {
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.25s;
}

.icon:hover {
  opacity: 1;
}

</style>
