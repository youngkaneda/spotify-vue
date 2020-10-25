<template>
    <div class="row">
        <h5 class="topic">Artists</h5>
        <div
            class="card waves-effect waves-light"
            v-for="artist in artists"
            :key="artist.id"
            @click="openArtist(artist)"
        >
            <img class="artist-image" :src="artist.images[1].url" alt="" />
            <p class="artist-name">{{ artist.name }}</p>
            <p class="artist">Artist</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../props';

export default {
    data() {
        return {
            artists: [],
        };
    },
    beforeMount() {
        axios
            .get(`${props.api}/me/following?type=artist&limit=50`, {
                headers: {
                    Authorization:
                        `Bearer ${
                            JSON.parse(window.localStorage.getItem('spotify'))
                                .access_token}`,
                },
            })
            .then((response) => {
                this.artists = response.data.artists.items;
            });
    },
    methods: {
        openArtist(artist) {
            this.$router.push({
                path: '/browse/artist',
                query: { id: artist.id },
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
.artist {
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
