import { shallowMount } from '@vue/test-utils';

export function mountAction(Component, { inputString = '', useFile = false, inputFile = {} } = {}) {
  return shallowMount(Component, {
    props: {
      inputString,
      inputFile,
      useFile
    },
    global: {
      stubs: {
        NoteBlock: true,
        Copy: true,
        QrcodeVue: true
      },
      directives: {
        highlightjs: {}
      }
    }
  });
}
