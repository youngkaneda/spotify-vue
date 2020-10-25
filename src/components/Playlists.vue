<template>
    <div class="row">
        <h5 class="topic">Playlists</h5>
        <div
            class="card waves-effect waves-light"
            v-for="playlist in playlists"
            :key="playlist.id"
            @click="openPlaylist(playlist)"
        >
            <img class="playlist-image" :src="playlist.images[0].url" alt="" />
            <p class="playlist-name">
                {{
                    playlist.name && playlist.name !== " "
                        ? playlist.name
                        : "Untitled"
                }}
            </p>
            <p class="owner">
                {{ playlist.owner ? playlist.owner.display_name : "Untitled" }}
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../props';

export default {
    data() {
        return {
            playlists: [],
        };
    },
    beforeMount() {
        axios
            .get(`${props.api}/me/playlists?limit=50`, {
                headers: {
                    Authorization:
                        `Bearer ${
                            JSON.parse(window.localStorage.getItem('spotify'))
                                .access_token}`,
                },
            })
            .then((response) => {
                this.playlists = response.data.items;
            });
    },
    methods: {
        openPlaylist(playlist) {
            this.$router.push({
                path: '/browse/playlist',
                query: { id: playlist.id },
            });
        },
    },
};
</script>

<style scoped>
.topic {
    margin-top: 1%;
    font-weight: bold;
    margin-left: 0.7%;
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
