<template>
    <div class="row">
        <h5 class="topic">Artists</h5>
        <div class="card waves-effect waves-light" v-for="artist in artists" :key="artist.id" @click="openArtist(artist)">
            <img class="artist-image" :src="artist.images[1].url" alt="">
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
        }
    },
    beforeMount() {
        axios.get(`${props.api}/me/following?type=artist&limit=50`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            }
        })
        .then((response) => {
            this.artists = response.data.artists.items;
        });
    },
    methods: {
        openArtist(artist) {
            this.$router.push({ path: '/browse/artist', query: { id: artist.id } });
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
.artist-image {
    border-radius: 50%;
    width: 8em;
    height: 8em;
    margin-top: 11%;
    margin-left: 12%;
}
.artist-name {
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
