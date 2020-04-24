<template>
    <div v-if="activeDeviceId === deviceId && activeDeviceId != null">
        <div id="song-preview" class="col s2">
            <div style="margin-top: 2%">
                <img v-if="currentTrack.album.images" :src="currentTrack.album.images[1].url">            
            </div>
            <div id="song-info">
                <p id="song-name">{{ currentTrack.name }}</p>
                <p id="artist-name">{{ currentTrack.artists ? currentTrack.artists[0].name : null }}</p>
            </div>
        </div>
        <div id="sdk-player" class="col s8">
            <div id="options">
                <i class="material-icons left waves-wispy minorOp" 
                    @click="shuffle"
                    :style="{color: context.shuffle ? 'blue': '#A8C0D8'}" 
                    id="shuffle"
                >
                    shuffle
                </i>
                <i class="material-icons left waves-effect waves-wispy" @click="skipToPrevious">skip_previous</i>
                <i v-if="!context.paused" class="material-icons left waves-effect waves-wispy" @click="pause">pause</i>
                <i v-else class="material-icons left waves-effect waves-wispy" @click="resume">play_arrow</i>
                <i class="material-icons left waves-effect waves-wispy" @click="skipToNext">skip_next</i>
                <i class="material-icons left waves-wispy minorOp"
                    @click="repeat"
                    :style="{color: !!context.repeat_mode ? 'blue': '#A8C0D8'}"
                    id="repeat"
                >
                    {{ repeatModes[context.repeat_mode] === 'track' ? 'repeat_one' : 'repeat' }}
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
                        tooltip="none"
                        :process-style="{ background: '#A8C0D8' }"
                        :bg-style="{ background: '#737575' }"
                        :lazy="true" 
                        :max="currentTrack.duration_ms ? currentTrack.duration_ms : 0"
                        v-on:change="seekPosition">
                    </VueSlider>
                </div>
                <div style="margin-top: 0.3%; margin-left: 1%">
                    {{ currentTrack.duration_ms ? getTimeDisplay(currentTrack.duration_ms) : null }}
                </div>
            </div>
        </div>
        <div class="col s2" id="volume">
            <i class="material-icons left waves-wispy volumeIcon" @click="openQueue">queue_music</i>
            <i v-if="volume" class="material-icons left waves-wispy volumeIcon" @click="mute">volume_up</i>
            <i v-else class="material-icons left waves-wispy volumeIcon">volume_off</i>
            <div style="width: 60%;">
                <VueSlider 
                    v-model="volume"
                    tooltip="none"
                    :dot-size="15"
                    :silent="true"
                    :process-style="{ background: '#A8C0D8' }"
                    :bg-style="{ background: '#737575' }"
                    :lazy="true" 
                    :max="100"
                    v-on:change="changeVolume">
                </VueSlider>
            </div>
        </div>
    </div>
    <div id="warning" v-else>
        Please connect with this device to use the player functionalities.
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import axios from 'axios';
import props from '../../props';

export default {
    components: {
        VueSlider,
    },
    data() {
        return {
            progress: 0,
            volume: 100,
            repeatModes: ['off', 'context', 'track',],
            //
            timerId: null,
        }
    },
    computed: {
        currentTrack() {
            return this.$store.state.currentTrack;
        },
        queue() {
            return this.$store.state.queue;
        },
        deviceId() {
            return this.$store.state.deviceId;
        },
        player() {
            return this.$store.state.player;
        },
        activeDeviceId() {
            return this.$store.state.activeDeviceId;
        },
        context() {
            return this.$store.state.context;
        },
    },
    watch: {
        context(value) {
            // if player state null
            if (!value) {
                clearInterval(this.timerId);
                return;
            }
            //
            this.progress = this.context.position;
            //
            clearInterval(this.timerId);
            this.timerId = setInterval(() => {
                if (this.context.paused) {
                    return;
                }
                if (this.progress + 1000 < this.currentTrack.duration_ms) {
                    this.progress += 1000;
                } else {
                    clearInterval(this.timerId);
                }
            }, 1000);
        },
    },
    methods: {
        mute() {
            axios.put(`${props.api}/me/player/volume?device_id=${this.deviceId}&volume_percent=${0}`,
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                },
            )
            .then((response) => {
                this.volume = 0;
            });
        },
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
            axios.put(`${props.api}/me/player/shuffle?device_id=${this.deviceId}&state=${!this.context.shuffle}`,
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                },
            );
        },
        repeat() {
            let nextRepeatModeIndex = this.repeatModes.indexOf(this.repeatModes[this.context.repeat_mode]) + 1;
            if (nextRepeatModeIndex === this.repeatModes.length) {
                nextRepeatModeIndex = 0;
            }
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
            axios.put(`${props.api}/me/player/volume?device_id=${this.deviceId}&volume_percent=${this.volume}`,
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                },
            );
        },
        openQueue() {
            this.$router.push('/browse/queue');
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
    margin-top: 1%;
}
#song-info p {
    margin: 0;
}
#song-name {
    font-weight: bold;
    font-size: 110%;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    overflow: hidden;
    width: 10em;
}
#artist-name {
    font-size: 90%;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    overflow: hidden;
    width: 10em;
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
#volume {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 1.6% 0 0 0;
    padding-left: 5%;
    padding-right: 1%;
}
i {
    font-size: 260%;
    color: rgb(106, 161, 216);
}
.minorOp {
    font-size: 150%;
    margin-top: 1.2%;
}
.volumeIcon {
    font-size: 150%;
}
i:hover {
    cursor: pointer;
    color: #1b7cde;
}
#warning {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>