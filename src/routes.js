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

export default [
    { path: '/redirect', component: Redirect },
    { path: '/', component: Index },
    {
        path: '/browse',
        component: Browse,
        children: [
            { path: '/browse/queue', component: Queue },
            { path: '/browse/albums', component: Albums },
            { path: '/browse/album', component: Album },
            { path: '/browse/artists', component: Artists },
            { path: '/browse/artist', component: Artist },
            { path: '/browse/playlists', component: Playlists },
            { path: '/browse/playlist', component: Playlist },
            {
                path: '/browse/search',
                name: 'search',
                component: Search,
                props: true,
            },
            { path: '', component: Home },
        ],
    },
];
