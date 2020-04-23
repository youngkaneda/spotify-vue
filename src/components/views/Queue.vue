<template>
    <div>
        <h4 style="font-weight: bold;">Play Queue</h4>
        <h5 class="topic">Now Playing</h5>
        <div class="song">
            <div class="icon">
                <i style="cursor: pointer; color: #1b7cde;" class="material-icons left waves-wispy" 
                    @click="togglePlay()"
                >
                    {{ currentTrack.is_playing ? 'pause' : 'play_arrow'}}
                </i>
            </div>
            <div class="song-info">
                <p class="song-name current">{{ currentTrack.name }} <span style="font-size: 90%"> - {{ getTimeDisplay(currentTrack.duration_ms) }} </span></p>
                <p class="artist-info">
                    <span class="link" @click="openArtist(currentTrack.artists[0])">
                        {{ currentTrack.artists ? currentTrack.artists.map(el => el.name).join(', ') : '' }}
                    </span>
                    &centerdot;
                    <span class="link" @click="openAlbum(currentTrack.album)">
                        {{ currentTrack.album ? currentTrack.album.name : '' }}
                    </span>
                </p>
            </div>
        </div>
        <h5 class="topic">Next in Queue</h5>
        <div class="song" v-for="(track, i) in queue" :key="track.id + i">
            <div class="icon">
                <i style="cursor: pointer;" 
                    class="material-icons left waves-wispy volumeIcon"
                    @click="play(track)"
                >
                    play_arrow
                </i>
            </div>
            <div class="song-info">
                <p class="song-name">{{ track.name }} <span style="font-size: 90%"> - {{ getTimeDisplay(track.duration_ms) }} </span></p>
                <p class="artist-info">
                    <span class="link" @click="openArtist(track.artists[0])">
                        {{ track.artists ? track.artists.map(el => el.name).join(', ') : '' }}
                    </span>
                    &centerdot;
                    <span class="link" @click="openAlbum(track.album)">{{ track.album ? track.album.name : '' }} </span>
                </p>
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
        }
    },
    computed: {
        deviceId() {
            return this.$store.state.deviceId;
        },
        currentTrack() {
            return this.$store.state.currentTrack;
        },
        queue() {
            return this.$store.state.queue;
        }
    },
    methods: {
        play(track) {
            axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`,
                {
                    'uris': [track.uri],
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                }
            )
            .then((response) => {
                this.$store.commit('skipQueueToTrack', track.id);
            });
        },
        togglePlay() {
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
            };
        },
        openAlbum(album) {
            this.$router.push({ path: '/browse/album', query: { id: album.uri.split(':')[2] } });
        },
        openArtist(artist) {
            this.$router.push({ path: '/browse/artist', query: { id: artist.uri.split(':')[2] } });
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
p, span {
    font-size: 105%;
}
.song {
    padding: 0.5% 0 0.5% 0.7%;
}
.song:hover {
    background-color: rgb(100, 100, 100, 0.1);
}
.topic {
    margin-top: 1%;
}
.song-name {
    font-size: 110%;
    white-space: nowrap;
    word-wrap: break-word;
    overflow: hidden;
    width: 70em;
    text-overflow: ellipsis;
}
.current {
    color: #1b7cde;
}
.artist-info {
    white-space: nowrap;
    word-wrap: break-word;
    overflow: hidden;
    width: 70em;
    text-overflow: ellipsis;
}
.song {
    display: flex;
    flex-direction: row;
}
p {
    margin: 0;
}
.icon {
    padding-top: 0.3%;
    padding-left: 0.3%;
}
.link {
    color: rgb(70, 70, 70);
}
.link:hover {
    text-decoration: underline;
    color: black;
    cursor: pointer;
}
</style>
