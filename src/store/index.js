import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    file: null,
    fileContentsAsArrayBuffer: null,
    fileContentsAsText: null,
    isText: false,
    isImage: false,
    text: ''
  },
  mutations: {
    setFile (state, file) {
      state.file = file;
    },
    setFileContentsAsArrayBuffer (state, fileContents) {
      state.fileContentsAsArrayBuffer = fileContents;
    },
    setFileContentsAsText (state, fileContents) {
      state.fileContentsAsText = fileContents;
    },
    removeFile (state) {
      state.file = null;
      state.fileContents = '';
    },
    setText (state, { text }) {
      state.text = text;
      state.file = '';
    }
  },
  actions: {
    setFile ({ commit }, file) {
      return new Promise((resolve) => {
        const arrayBufferReader = new FileReader();
        const textReader = new FileReader();
        let remaining = 2;

        commit('setFile', file);

        arrayBufferReader.onload = function(e) {
          commit('setFileContentsAsArrayBuffer', e.target.result);

          remaining--;

          if (!remaining) {
            resolve();
          }
        };

        textReader.onload = function(e) {
          commit('setFileContentsAsText', e.target.result);

          remaining--;

          if (!remaining) {
            resolve();
          }
        };

        arrayBufferReader.readAsArrayBuffer(file);
        textReader.readAsText(file);
      });
    }
  },
  getters: {
    input: state => {
      return state.file
        ? state.file
        : state.text;
    }
  }
});
