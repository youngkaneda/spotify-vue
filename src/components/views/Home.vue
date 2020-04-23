<template>
    <div class="home">
        <h5 class="topic">Recently played</h5>
        <div class="row">
            <div class="card waves-effect waves-light" v-for="track in recentlyPlayed" :key="track.id" @click="openAlbum(track.album)">
                <img class="song-image" :src="track.album.images[1].url" alt="">
                <p class="song-name">{{ track.name }}</p>
                <p class="artist">{{ track.artists.map(el => el.name).join(', ') }}</p>
                <a class="btn-floating btn-large waves-effect waves-light play"
                    @click="togglePlay($event, track)"
                    :style="[(track.id === currentTrack.id || isLinkedFrom(track.id)) && currentTrack.is_playing ? {display: 'block !important'} : {}]"
                >
                    <i  v-if="(track.id === currentTrack.id || isLinkedFrom(track.id)) && currentTrack.is_playing"
                        class="material-icons" style="font-size: 200%"
                    >
                        pause
                    </i>
                    <i  v-else class="material-icons" style="font-size: 200%">
                        play_arrow
                    </i>
                </a>
            </div>
        </div>
        <h5 class="topic">Your favorites</h5>
        <div class="row">
            <div class="card waves-effect waves-light" v-for="track in favorites" :key="track.id" @click="openAlbum(track.album)">
                <img class="song-image" :src="track.album.images[1].url" alt="">
                <p class="song-name">{{ track.name }}</p>
                <p class="artist">{{ track.artists.map(el => el.name).join(', ') }}</p>
                <a class="btn-floating btn-large waves-effect waves-light play"
                    @click="togglePlay($event, track)"
                    :style="[track.id === currentTrack.id || isLinkedFrom(track.id) ? {display: 'block !important'} : {}]"
                >
                    <i  v-if="(track.id === currentTrack.id || isLinkedFrom(track.id)) && currentTrack.is_playing"
                        class="material-icons" style="font-size: 200%"
                    >
                        pause
                    </i>
                    <i  v-else class="material-icons" style="font-size: 200%">
                        play_arrow
                    </i>
                </a>
            </div>
        </div>
        <h5 class="topic">New releases</h5>
        <div class="row">
            <div class="card waves-effect waves-light" v-for="album in newReleases" :key="album.id" @click="openAlbum(album)">
                <img class="song-image" :src="album.images[1].url" alt="">
                <p class="song-name">{{ album.name }}</p>
                <p class="artist">{{ album.artists.map(el => el.name).join(', ') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../../props';

export default {
    data() {
        return {
            recentlyPlayed: [],
            favorites: [],
            newReleases: [],
        }
    },
    computed: {
        currentTrack() {
            return this.$store.state.currentTrack;
        },
        deviceId() {
            return this.$store.state.deviceId;
        }
    },
    beforeMount() {
        axios.get(`${props.api}/me/player/recently-played?limit=9`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            }
        })
        .then((response) => {
            let keys = [];
            this.recentlyPlayed = response.data.items.filter((el) => {
                if (keys.indexOf(el.track.id) === -1) {
                    keys.push(el.track.id);
                    return true;
                }
                return false;
            })
            .map((el) => el.track);
        });
        axios.get(`${props.api}/me/top/tracks?limit=9`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            }
        })
        .then((response) => {
            this.favorites = response.data.items;
        });
        axios.get(`${props.api}/browse/new-releases?limit=9`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            }
        })
        .then((response) => {
            this.newReleases = response.data.albums.items;
        });
    },
    methods: {
        togglePlay(event, track) {
            event.stopPropagation();
            event.preventDefault();
            //
            if (track.id === this.currentTrack.id || this.isLinkedFrom(track.id)) {
                if (this.currentTrack.is_playing) {
                    axios.put(`${props.api}/me/player/pause?device_id=${this.deviceId}`, null, {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                        },
                    });
                } else {
                    axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`, null, {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                        },
                    });
                }
            } else {
                axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`,
                    {
                        'uris': [track.uri],
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                        },
                    }
                );
            }
        },
        isLinkedFrom(id) {
            let linkedFrom = this.currentTrack.linked_from;
            return linkedFrom ? linkedFrom.id === id : false;
        },
        openAlbum(album) {
            this.$router.push({ path: '/browse/album', query: { id: album.id } });
        },
    }
}
</script>

<style scoped>
p, span {
    font-size: 105%;
}
.topic {
    margin-top: 1%;
    font-weight: bold;
}
/*  */
.play {
    position: absolute;
    top: 72%;
    left: 60%;
    cursor: default;
    display: none;
    background-color: #A8C0D8;
}
.card:hover .play {
    display: block;
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
.song-image {
    width: 8em;
    height: 8em;
    margin-top: 11%;
    margin-left: 12%;
}
.song-name {
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
