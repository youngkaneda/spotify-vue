<template>
    <div class="row">
        <h5 class="topic">Playlists</h5>
        <div class="card waves-effect waves-light" v-for="playlist in playlists" :key="playlist.id" @click="openPlaylist(playlist)">
            <img class="playlist-image" :src="playlist.images[0].url" alt="">
            <p class="playlist-name">{{ playlist.name && playlist.name !== ' ' ? playlist.name : 'Untitled' }}</p>
            <p class="owner">{{ playlist.owner ? playlist.owner.display_name : 'Untitled' }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../../props';

export default {
    data() {
        return {
            playlists: [],
        }
    },
    beforeMount() {
        axios.get(`${props.api}/me/playlists?limit=50`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            }
        })
        .then((response) => {
            this.playlists = response.data.items;
        });
    },
    methods: {
        openPlaylist(playlist) {
            this.$router.push({ path: '/browse/playlist', query: { id: playlist.id } });
        },
    },
}
</script>

<style scoped>
.topic {
    margin-top: 1%;
    font-weight: bold;
    margin-left: 0.7%;
}
.card {
    cursor: pointer;
    display: inline-block;
    flex-direction: column;
    width: 10%;
    background-color: rgb(225, 225, 225, 0.7);
    border-radius: 3%;
    margin-top: 1%;
    margin-left: 0.9%;
}
.playlist-image {
    width: 8em;
    height: 8em;
    margin-top: 11%;
    margin-left: 12%;
}
.playlist-name {
    font-weight: bold;
    color: #1b7cde;
    margin-left: 11.5%;
    font-size: 110%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 77%;
    margin-top: 7%;
    margin-bottom: 1%;
}
.owner {
    margin-top: 3%;
    margin-left: 11.5%;
    margin-bottom: 13%;
    font-size: 90%;
    word-break: break-all;
    white-space: nowrap;
    width: 78%;
    overflow: hidden;
    color: rgb(10, 10, 10, 0.7);
    text-overflow: ellipsis;
}
</style>