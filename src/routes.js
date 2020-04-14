import Redirect from './components/Redirect.vue';
import Home from './components/Home.vue';
import Browse from './components/Browse.vue';

export default [
    { path: '/redirect', component: Redirect },
    { path: '/', component: Home },
    { path: '/browse', component: Browse },
];
