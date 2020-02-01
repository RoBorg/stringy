<template>
  <div>
    <NoteBlock note v-if="text.trim() !== ''">Unrecognised format - please choose an action</NoteBlock>
    <NoteBlock note v-else-if="useFile">File is empty</NoteBlock>
  </div>
</template>

<script>
  import action from './action.mixin';
  import NoteBlock from '../NoteBlock.vue';

  export default {
    name: 'Unknown',
    mixins: [action],
    components: {
      NoteBlock
    },
    canParse () {
      return false;
    }
  }
</script>
