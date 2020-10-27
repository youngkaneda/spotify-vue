import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/css/global.css';

Vue.filter('formatter', (number) => number.toLocaleString());

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
