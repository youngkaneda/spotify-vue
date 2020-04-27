import Vue from 'vue';
import VueRouter from 'vue-router';
import Redirect from '../views/Redirect.vue';
import Index from '../views/Index.vue';
import Browse from '../views/Browse.vue';
import Home from '../components/Home.vue';
import Queue from '../components/Queue.vue';
import Albums from '../components/Albums.vue';
import Album from '../components/Album.vue';
import Artists from '../components/Artists.vue';
import Artist from '../components/Artist.vue';
import Playlists from '../components/Playlists.vue';
import Playlist from '../components/Playlist.vue';
import Search from '../components/Search.vue';
import NotFound from '../views/NotFound.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/redirect', component: Redirect },
    { path: '/', component: Index },
    {
        path: '/browse',
        component: Browse,
        children: [
            { path: 'queue', component: Queue },
            { path: 'albums', component: Albums },
            { path: 'album', component: Album },
            { path: 'artists', component: Artists },
            { path: 'artist', component: Artist },
            { path: 'playlists', component: Playlists },
            { path: 'playlist', component: Playlist },
            {
                path: 'search',
                name: 'search',
                component: Search,
                props: true,
            },
            { path: '', component: Home },
        ],
    },
    { path: '*', component: NotFound },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
