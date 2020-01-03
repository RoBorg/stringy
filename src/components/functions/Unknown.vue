<template>
  <div>
    <note-block tip><code>md-file</code> works just like a regular <code>md-input</code> component. This means that you can pass any <code>md-input</code> prop to <code>md-file</code>, like <strong>placeholder</strong>, <strong>required</strong> and <strong>disabled</strong>, for example.</note-block>
  </div>
</template>

<script>
import { NoteBlock } from '../NoteBlock.vue';

export default {
  name: 'Unknown',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  components: {
    NoteBlock
  },
  computed: {
    outputString: function () {
      return 'Dunno LOL';
    }
  },
  canParse () {
    return false;
  }
}
</script>
