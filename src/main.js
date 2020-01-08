import Vue from 'vue';
import App from './App.vue';
import Copy from './components/Copy';
import VueHighlightJS from 'vue-highlightjs';
import VueMaterial from 'vue-material'; // TODO remove - see https://vuematerial.io/getting-started import individual components
import store from './store/index';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
// todo import 'vue-material/dist/theme/default-dark.css'

library.add(faCopy);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('Copy', Copy);

Vue.use(VueHighlightJS);
Vue.use(VueMaterial); // TODO remove

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
