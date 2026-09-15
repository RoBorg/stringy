import OutputBlock from '../OutputBlock';

export default {
  components: {
    OutputBlock
  },
  props: {
    inputString: {
      type: String,
      required: true
    },
    inputFile: {
      type: Object,
      required: true
    },
    useFile: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    text() {
      return this.useFile ? this.inputFile.asText : this.inputString;
    }
  }
};
