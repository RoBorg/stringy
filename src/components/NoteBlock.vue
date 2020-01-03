<template>
  <div class="note-block" :class="[{ alert, tip, warning }]">
    <slot />
  </div>
</template>

<script>
  // import MdComponent from 'vue-material/src/core/MdComponent'

  // export default MdComponent({
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
  // @import "~vue-material/dist/components/MdAnimation/variables";
  @import "~vue-material/dist/theme/engine";

  $note-border: md-get-palette-color(orange, A200);
  $alert-border: md-get-palette-color(red, A200);
  $tip-border: md-get-palette-color(green, 500);

  .note-block {
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
