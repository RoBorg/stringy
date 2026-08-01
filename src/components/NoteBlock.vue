<template>
  <div class="note-block" :class="[{ alert, tip, warning }]">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'NoteBlock',
    props: {
      alert: Boolean,
      warning: Boolean,
      tip: Boolean
    }
  }
</script>

<style lang="scss" scoped>
  $note-border: #ffab40;
  $alert-border: #ff5252;
  $tip-border: #4caf50;

  .note-block {
    background-color: #f5f5f5;
    margin: 1.5em 0;
    padding: 8px 16px;
    overflow: hidden;
    border-left: 4px solid $note-border;

    &.alert {
      border-left-color: $alert-border;
    }

    &.tip {
      border-left-color: $tip-border;
    }

    &.warning {
      font-size: 15px;
    }
  }
</style>
