import Vue from 'vue';
import App from './App.vue';
import Copy from './components/Copy';
import NoteBlock from './components/NoteBlock';
import VueHighlightJS from 'vue-highlightjs';
import { MdApp, MdButton, MdCard, MdCheckbox, MdContent, MdDivider, MdField, MdRadio, MdSnackbar, MdTabs, MdToolbar } from 'vue-material/dist/components'
import store from './store/index';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

library.add(faCopy);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('Copy', Copy);
Vue.component('NoteBlock', NoteBlock);

Vue.use(VueHighlightJS);

Vue.use(MdApp);
Vue.use(MdButton);
Vue.use(MdCard);
Vue.use(MdCheckbox);
Vue.use(MdContent);
Vue.use(MdDivider);
Vue.use(MdField);
Vue.use(MdRadio);
Vue.use(MdSnackbar);
Vue.use(MdTabs);
Vue.use(MdToolbar);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
