<template>
  <div>
    <NoteBlock note v-if="inputString.trim() !== ''">Unrecognised format - please choose an action</NoteBlock>
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
