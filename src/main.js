import Vue from 'vue';
import App from './App.vue';
import Copy from './components/Copy';
import VueHighlightJS from 'vue-highlightjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCopy);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('Copy', Copy);

Vue.use(VueHighlightJS);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
