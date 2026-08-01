import { createApp } from 'vue';
import App from './App.vue';
import Copy from './components/Copy';
import NoteBlock from './components/NoteBlock';
import store from './store/index';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import highlightjs from './directives/highlightjs';

import './css/ui.css';
import 'highlight.js/styles/default.css';

library.add(faCopy);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.component('Copy', Copy);
app.component('NoteBlock', NoteBlock);

app.directive('highlightjs', highlightjs);

app.use(store);

app.mount('#app');
