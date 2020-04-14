<template>
    <div id="player" class="row">
        <div id="song-preview" class="col s2">
            <div>
                <img v-if="currentTrackMetadata.image" :src="currentTrackMetadata.image">            
            </div>
            <div id="song-info">
                <p id="song-name">{{ currentTrackMetadata.name }}</p>
                <p id="artist-name">{{ currentTrackMetadata.artist }}</p>
            </div>
        </div>
        <div id="sdk-player" class="col s10">
            <div id="options">
                <i class="material-icons left waves-effect waves-wispy" @click="skipToPrevious">skip_previous</i>
                <i v-if="isPlaying" class="material-icons left waves-effect waves-wispy" @click="pause">pause</i>
                <i v-else class="material-icons left waves-effect waves-wispy" @click="resume">play_arrow</i>
                <i class="material-icons left waves-effect waves-wispy" @click="skipToNext">skip_next</i>
            </div>
            <div id="slide">
                <VueSlider></VueSlider>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import axios from 'axios';
import props from '../props';

export default {
    components: {
        VueSlider,
    },
    data() {
        return {
            isPlaying: false,
            player: {},
            deviceId: null,
            currentTrackMetadata: {},
            // isShuffled: false,
        }
    },
    mounted() {
        const token = JSON.parse(window.localStorage.getItem('spotify')).access_token;
        this.player = new window.Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
        this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
        this.player.addListener('account_error', ({ message }) => { console.error(message); });
        this.player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        this.player.addListener('player_state_changed', state => { 
            //
            this.isPlaying = !state.paused;
            // this.isShuffled = state.shuffle;
            //
            const currentTrack = state.track_window.current_track;
            this.currentTrackMetadata.image = currentTrack.album.images[1].url;
            this.currentTrackMetadata.name = currentTrack.name;
            this.currentTrackMetadata.artist = currentTrack.artists[0].name;
            //
            console.log(state);
            console.log(this.currentTrackMetadata);
        });

        // Ready
        this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.deviceId = device_id;
        });

        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        this.player.connect();
    },
    methods: {
        pause() {
            axios.put(`${props.api}/me/player/pause?device_id=${this.deviceId}`, null, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                },
            });
        },
        resume() {
            axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`, null, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                },
            });
        },
        skipToNext() {
            axios.post(`${props.api}/me/player/next?device_id=${this.deviceId}`, null, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                },
            });
        },
        skipToPrevious() {
            axios.post(`${props.api}/me/player/previous?device_id=${this.deviceId}`, null, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                },
            });
        },
    },
}
</script>

<style scoped>
#song-preview {
    display: flex;
    flex-direction: row;
    margin-top: 0.3%;
}
#song-info {
    margin-left: 3%;
    margin-top: 3%;
}
#song-info p {
    margin: 0;
}
#song-name {
    font-weight: bold;
    font-size: 110%;
}
#artist-name {
    font-size: 90%;
}
#player {
    bottom: 0;
    position: absolute;
    margin: 0;
    /* padding: 0.3% 0% 0.3% 0%; */
    width: 100%;
    background-color: #ededed;
}
#sdk-player {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* align-items: center; */
    margin: 0;
}
#options {
    display: flex;
    flex-direction: row;
    margin-top: 0.3%;
    margin-left: 34.9%;
}
#slide {
    margin-top: 0.5%;
    width: 47%;
    margin-left: 16.9%;
}
i {
    font-size: 260%;
    color: rgb(106, 161, 216);
}

i:hover {
    cursor: pointer;
    color: #1b7cde;
}
</style>