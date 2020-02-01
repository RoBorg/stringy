import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    useFile: false,
    file: null,
    fileContentsAsArrayBuffer: null,
    fileContentsAsDataUrl: null,
    fileContentsAsText: null,
    fileIsLoaded: false,
    text: ''
  },
  mutations: {
    setFileIsLoaded (state, fileIsLoaded) {
      state.useFile = true;
      state.fileIsLoaded = fileIsLoaded;
    },
    setFile (state, file) {
      state.file = file;
    },
    setFileContentsAsArrayBuffer (state, fileContents) {
      state.fileContentsAsArrayBuffer = fileContents;
    },
    setFileContentsAsDataUrl (state, fileContents) {
      state.fileContentsAsDataUrl = fileContents;
    },
    setFileContentsAsText (state, fileContents) {
      state.fileContentsAsText = fileContents;
    },
    removeFile (state) {
      state.useFile = false;
      state.file = null;
      state.fileIsLoaded = false;
      state.fileContentsAsArrayBuffer = null;
      state.fileContentsAsText = null;
    },
    setText (state, text) {
      state.useFile = false;
      state.text = text;
      state.file = null;
    },
    setUseFile (state, useFile) {
      state.useFile = useFile;
    }
  },
  actions: {
    setFile ({ commit }, file) {
      return new Promise((resolve) => {
        const arrayBufferReader = new FileReader();
        const dataUrlReader = new FileReader();
        const textReader = new FileReader();
        let remaining = 3;
        const loaded = () => {
          remaining--;

          if (!remaining) {
            commit('setFileIsLoaded', true);
            resolve();
          }
        };

        commit('setFileIsLoaded', false);
        commit('setFile', file);

        arrayBufferReader.onload = function(e) {
          commit('setFileContentsAsArrayBuffer', e.target.result);
          loaded();
        };

        dataUrlReader.onload = function(e) {
          commit('setFileContentsAsDataUrl', e.target.result);
          loaded();
        };

        textReader.onload = function(e) {
          commit('setFileContentsAsText', e.target.result);
          loaded();
        };

        arrayBufferReader.readAsArrayBuffer(file);
        dataUrlReader.readAsDataURL(file);
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
