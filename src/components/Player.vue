<template>
    <div id="player" class="row">
        <div id="song-preview" class="col s2">
            <div>
                <img v-if="currentTrack.image" :src="currentTrack.image">            
            </div>
            <div id="song-info">
                <p id="song-name">{{ currentTrack.name }}</p>
                <p id="artist-name">{{ currentTrack.artist }}</p>
            </div>
        </div>
        <div id="sdk-player" class="col s8">
            <div id="options">
                <i class="material-icons left waves-wispy minorOp" 
                    @click="shuffle"
                    :style="{color: isShuffled ? 'blue': '#A8C0D8'}" 
                    id="shuffle"
                >
                    shuffle
                </i>
                <i class="material-icons left waves-effect waves-wispy" @click="skipToPrevious">skip_previous</i>
                <i v-if="isPlaying" class="material-icons left waves-effect waves-wispy" @click="pause">pause</i>
                <i v-else class="material-icons left waves-effect waves-wispy" @click="resume">play_arrow</i>
                <i class="material-icons left waves-effect waves-wispy" @click="skipToNext">skip_next</i>
                <i class="material-icons left waves-wispy minorOp"
                    @click="repeat"
                    :style="{color: isRepating ? 'blue': '#A8C0D8'}"
                    id="repeat"
                >
                    {{ currentRepeatMode === 'track' ? 'repeat_one' : 'repeat' }}
                </i>
            </div>
            <div style="display: flex; flex-diretion: row; margin-left: 17%;">
                <div 
                    :style="[progress ? {} : {color: '#ededed'}, {marginTop: '0.3%'}]"
                >
                    {{ getTimeDisplay(progress) }}
                </div>
                <div id="slide">
                    <VueSlider 
                        v-model="progress"
                        :dot-size="15"
                        :silent="true"
                        :process-style="{ background: '#A8C0D8' }"
                        :bg-style="{ background: '#737575' }"
                        :lazy="true" 
                        :max="currentTrack.duration ? currentTrack.duration : null"
                        v-on:drag-end="seekPosition">
                    </VueSlider>
                </div>
                <div style="margin-top: 0.3%;">
                    {{ currentTrack.duration ? getTimeDisplay(currentTrack.duration) : null }}
                </div>
            </div>
        </div>
        <div class="col s2" id="volumeAndDevice">
            <i class="material-icons left waves-wispy deviceIcon">devices</i>
            <i v-if="volume" class="material-icons left waves-wispy volumeIcon">volume_up</i>
            <i v-else class="material-icons left waves-wispy volumeIcon">volume_off</i>
            <div style="width: 50%;">
                <VueSlider 
                    v-model="volume"
                    tooltip="none"
                    :dot-size="15"
                    :silent="true"
                    :process-style="{ background: '#A8C0D8' }"
                    :bg-style="{ background: '#737575' }"
                    :lazy="true" 
                    :max="100"
                    v-on:drag-end="changeVolume">
                </VueSlider>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import axios from 'axios';
import moment from 'moment';
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
            currentTrack: {},
            progress: 0,
            volume: 0,
            isShuffled: false,
            isRepating: false,
            //
            timerId: null,
            repeatModes: ['off', 'context', 'track',],
            currentRepeatMode: null,
        }
    },
    mounted() {
        // const token = JSON.parse(window.localStorage.getItem('spotify')).access_token;
        // this.player = new window.Spotify.Player({
        //     name: 'Web Playback SDK Quick Start Player',
        //     getOAuthToken: cb => { cb(token); }
        // });

        // // Error handling
        // this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
        // this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
        // this.player.addListener('account_error', ({ message }) => { console.error(message); });
        // this.player.addListener('playback_error', ({ message }) => { console.error(message); });

        // // Playback status updates
        // this.player.addListener('player_state_changed', state => { 
        //     // clear time positions
        //     this.progress = 0;
        //     //
        //     this.isPlaying = !state.paused;
        //     // this.isShuffled = state.shuffle;
        //     //
        //     const currentTrack = state.track_window.current_track;
        //     this.currentTrack.image = currentTrack.album.images[1].url;
        //     this.currentTrack.name = currentTrack.name;
        //     this.currentTrack.artist = currentTrack.artists[0].name;
        //     this.currentTrack.duration = currentTrack.duration_ms;
        //     //
        //     this.progress = state.position;
        //     //
        //     clearInterval(this.timerId);
        //     this.timerId = setInterval(() => {
        //         if (!this.isPlaying) {
        //             return ;
        //         }
        //         if (this.progress + 1000 < this.currentTrack.duration) {
        //             this.progress += 1000;
        //         }
        //         else {
        //             clearInterval(this.timerId);
        //         }
        //     }, 1000);
        // });

        // // Ready
        // this.player.addListener('ready', ({ device_id }) => {
        //     console.log('Ready with Device ID', device_id);
        //     this.deviceId = device_id;
        // });

        // // Not Ready
        // this.player.addListener('not_ready', ({ device_id }) => {
        //     console.log('Device ID has gone offline', device_id);
        // });

        // // Connect to the player!
        // this.player.connect();
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
        seekPosition() {
            axios.put(`${props.api}/me/player/seek?device_id=${this.deviceId}&position_ms=${this.progress}`, 
                null, 
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                },
            );
        },
        shuffle() {
            axios.put(`${props.api}/me/player/shuffle?device_id=${this.deviceId}&state=${!this.isShuffled}`,
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                },
            );
        },
        repeat() {
            let nextRepeatModeIndex = this.repeatModes.indexOf(this.currentRepeatMode) + 1;
            axios.put(`${props.api}/me/player/repeat?device_id=${this.deviceId}&state=${this.repeatModes[nextRepeatModeIndex]}`,
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                },
            );
        },
        changeVolume() {

        },
        getTimeDisplay(ms) {
            var seconds = (ms / 1000).toFixed(0);
            var minutes = Math.floor(seconds / 60);
            var hours = "";
            if (minutes > 59) {
                hours = Math.floor(minutes / 60);
                hours = (hours >= 10) ? hours : "0" + hours;
                minutes = Math.floor(minutes % 60);
                minutes = (minutes >= 10) ? minutes : "0" + minutes;
            }
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            if (hours != "") {
                return hours + ":" + minutes + ":" + seconds;
            }
            return "0" +  minutes + ":" + seconds;
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
    padding: 0.2% 0% 0.3% 0%;
    width: 100%;
    background-color: #ededed;
}
#sdk-player {
    display: flex;
    flex-direction: column;
    margin: 0;
}
#options {
    display: flex;
    flex-direction: row;
    margin-top: 0.3%;
    margin-left: 41.2%;
}
#slide {
    margin: 0.5% 0 0 1.3%;
    width: 70%;
}
#volumeAndDevice {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 1.4% 0 0 0;
    padding-left: 5%;
}
i {
    font-size: 260%;
    color: rgb(106, 161, 216);
}
.minorOp {
    font-size: 150%;
    margin-top: 1.2%;
}
.volumeIcon, .deviceIcon {
    font-size: 150%;
}
i:hover {
    cursor: pointer;
    color: #1b7cde;
}
</style>