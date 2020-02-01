import Output from '../Output';

export default {
  components: {
    Output
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
