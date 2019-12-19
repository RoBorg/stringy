<template>
  <div>
    {{ outputString }}
  </div>
</template>

<script>
export default {
  name: 'Unknown',
  props: {
    inputString: {
      type: String,
      required: true
    }
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
