import Redirect from './components/Redirect.vue';
import Index from './components/views/Index.vue';
import Browse from './components/views/Browse.vue';
import Home from './components/views/Home.vue';
import Queue from './components/views/Queue.vue';
import Albums from './components/views/Albums.vue';
import Album from './components/views/Album.vue';
import Artists from './components/views/Artists.vue';
import Artist from './components/views/Artist.vue';
import Playlists from './components/views/Playlists.vue';
import Playlist from './components/views/Playlist.vue';
import Search from './components/views/Search.vue';
import NotFound from './components/NotFound.vue';

export default [
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
