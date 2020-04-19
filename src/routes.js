import Redirect from './components/Redirect.vue';
import Index from './components/views/Index.vue';
import Browse from './components/views/Browse.vue';
import Home from './components/views/Home.vue';
import Queue from './components/views/Queue.vue';

export default [
    { path: '/redirect', component: Redirect },
    { path: '/', component: Index },
    {
        path: '/browse',
        component: Browse,
        children: [
            { path: '/browse/queue', component: Queue },
            { path: '', component: Home },
        ],
    },
];
