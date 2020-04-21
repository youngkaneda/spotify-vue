<template>
    <div class="row">
        <h5 class="topic">Albums</h5>
        <div class="card waves-effect waves-light" v-for="el in albums" :key="el.album.id" @click="openAlbum(el.album)">
            <img class="album-image" :src="el.album.images[1].url" alt="">
            <p class="album-name">{{ el.album.name }}</p>
            <p class="artist">{{ el.album.artists.map(el => el.name).join(', ') }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../../props';

export default {
    data() {
        return {
            albums: [],
        }
    },
    beforeMount() {
        axios.get(`${props.api}/me/albums?limit=50`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            }
        })
        .then((response) => {
            this.albums = response.data.items;
        });
    },
    methods: {
        openAlbum(album) {
            this.$router.push({ path: '/browse/album', query: { id: album.id } });
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
.album-image {
    width: 8em;
    height: 8em;
    margin-top: 11%;
    margin-left: 12%;
}
.album-name {
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