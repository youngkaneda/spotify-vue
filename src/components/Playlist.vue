<template>
    <div>
        <div class="header">
            <img class="playlist-image" :src="playlist.images ? playlist.images[0].url : null" alt="" srcset="">
            <div class="desc">
                <p style="margin: 0; font-size: 90%">PLAYLIST</p>
                <h3 style="margin: 0.5% 0 0 0">{{ playlist.name && playlist.name !== ' ' ? playlist.name : 'Untitled' }}</h3>
                <p style="margin: 0;"> {{ playlist.description }} </p>
                <p style="margin: 0 0 1% 0; font-size: 90%">
                    author:
                    <span style="margin: 0; font-size: 110%">{{ playlist.owner ? playlist.owner.display_name : '' }}</span>
                </p>
                <a class="square-btn waves-effect waves-light" @click="play(playlist)">PLAY</a>
            </div>
        </div>
        <p style="margin: 0; font-size: 90%">
            FOLLOWERS:
            <span style="margin: 0; font-size: 110%">{{ playlist.followers ? playlist.followers.total : 0 }}</span>
        </p>
        <br>
        <div class="table">
            <table>
                <tbody>
                    <tr v-for="el in (playlist.tracks ? playlist.tracks.items : [])" :key="el.track.id">
                        <td style="width: 3%;">
                            <i style="cursor: pointer;" class="material-icons left waves-wispy"
                               :style="[el.track.id === currentTrack.id || isLinkedFrom(el.track.id) ? {color: '#1b7cde'} : {}]"
                               @click="togglePlayTrack(el.track)"
                            >
                                {{ (el.track.id === currentTrack.id || isLinkedFrom(el.track.id)) && currentTrack.is_playing ? 'pause' : 'play_arrow'}}
                            </i>
                        </td>
                        <td style="width: 4%;">
                            <i style="cursor: pointer;" class="material-icons left waves-wispy" @click="addToQueue(el.track)">
                                add_to_queue
                            </i>
                        </td>
                        <td>
                            <span :style="[el.track.id === currentTrack.id || isLinkedFrom(el.track.id) ? {color: '#1b7cde'} : {}]">{{ el.track.name }}</span>
                            -
                            <span style="color: gray">{{ el.track.artists ? el.track.artists.map(el => el.name).join(', ') : null }}</span>
                        </td>
                        <td style="width: 3%">{{ getTimeDisplay(el.track.duration_ms) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="toast">
            <div id="img">
                <i class="material-icons left" style="color: white">
                    add_to_queue
                </i>
            </div>
            <div id="desc">Added to queue</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../props';

export default {
    data() {
        return {
            playlist: {},
        };
    },
    computed: {
        deviceId() {
            return this.$store.state.deviceId;
        },
        currentTrack() {
            return this.$store.state.currentTrack;
        },
    },
    beforeMount() {
        axios.get(`${props.api}/playlists/${this.$route.query.id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
            },
        })
            .then((response) => {
                this.playlist = response.data;
            });
    },
    methods: {
        play(playlist) {
            axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`,
                {
                    context_uri: playlist.uri,
                },
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                    },
                });
        },
        isLinkedFrom(id) {
            const linkedFrom = this.currentTrack.linked_from;
            return linkedFrom ? linkedFrom.id === id : false;
        },
        togglePlayTrack(track) {
            if (track.id === this.currentTrack.id || this.isLinkedFrom(track.id)) {
                if (this.currentTrack.is_playing) {
                    axios.put(`${props.api}/me/player/pause?device_id=${this.deviceId}`, null, {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                        },
                    });
                } else {
                    axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`, null, {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                        },
                    });
                }
            } else {
                axios.put(`${props.api}/me/player/play?device_id=${this.deviceId}`,
                    {
                        uris: [track.uri],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                        },
                    });
            }
        },
        addToQueue(track) {
            axios.post(`${props.api}/me/player/queue?device_id=${this.deviceId}&uri=${track.uri}`, null, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                },
            })
                .then((response) => {
                    this.$store.commit('addToQueue', track);
                    this.launchToast();
                });
        },
        launchToast() {
            const x = document.getElementById('toast');
            x.className = 'show';
            setTimeout(() => { x.className = x.className.replace('show', ''); }, 3000);
        },
        getTimeDisplay(ms) {
            let seconds = (ms / 1000).toFixed(0);
            let minutes = Math.floor(seconds / 60);
            let hours = '';
            if (minutes > 59) {
                hours = Math.floor(minutes / 60);
                hours = (hours >= 10) ? hours : `0${hours}`;
                minutes = Math.floor(minutes % 60);
                minutes = (minutes >= 10) ? minutes : `0${minutes}`;
            }
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : `0${seconds}`;
            if (hours != '') {
                return `${hours}:${minutes}:${seconds}`;
            }
            return `0${minutes}:${seconds}`;
        },
    },
};
</script>

<style scoped>
.playlist-image {
    width: 19%;
    margin-top: 1.7%;
}
.header {
    display: flex;
    flex-direction: row;
}
.desc {
    margin-top: 11.5%;
    margin-left: 1%;
}
.link {
    cursor: pointer;
    color: black;
    font-size: 110%;
}
.link:hover {
    color: #1b7cde;
    text-decoration: underline;
}
tr:hover {
    background-color: lightgray;
}
h3 {
    width: 25em;
    white-space: nowrap;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
}
/*  */
.square-btn{
    cursor: pointer;
    display: inline-block;
    padding: 7px 40px;
	border-radius: 25px;
    font-weight: bold;
    text-decoration: none;
    color: #FFF;
    background-image: -webkit-linear-gradient(45deg, rgb(53, 168, 111) 0%, rgb(53, 168, 111) 100%);
    background-image: linear-gradient(45deg, rgb(53, 168, 111) 0%, rgb(53, 168, 111) 100%);
    transition: .4s;
}
/*  */
#toast {
    visibility: hidden;
    max-width: 50px;
    height: 50px;
    /*margin-left: -125px;*/
    margin: auto;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    position: fixed;
    z-index: 1;
    left: 0;right:0;
    top: 30px;
    font-size: 17px;
    white-space: nowrap;
}
#toast #img{
	width: 50px;
	height: 50px;
    float: left;
    padding: 13px;
    box-sizing: border-box;
    background-color: #111;
    color: #fff;
}
#toast #desc{
    color: #fff;
    padding: 3%;
    margin-top: 0;
    overflow: hidden;
	white-space: nowrap;
}

#toast.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, expand 0.5s 0.5s,stay 3s 1s, shrink 0.5s 2s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, expand 0.5s 0.5s,stay 3s 1s, shrink 0.5s 4s, fadeout 0.5s 4.5s;
}

@-webkit-keyframes fadein {
    from {top: 0; opacity: 0;}
    to {top: 30px; opacity: 1;}
}

@keyframes fadein {
    from {top: 0; opacity: 0;}
    to {top: 30px; opacity: 1;}
}

@-webkit-keyframes expand {
    from {min-width: 50px}
    to {min-width: 350px}
}

@keyframes expand {
    from {min-width: 50px}
    to {min-width: 350px}
}
@-webkit-keyframes stay {
    from {min-width: 350px}
    to {min-width: 350px}
}

@keyframes stay {
    from {min-width: 350px}
    to {min-width: 350px}
}
@-webkit-keyframes shrink {
    from {min-width: 350px;}
    to {min-width: 50px;}
}

@keyframes shrink {
    from {min-width: 350px;}
    to {min-width: 50px;}
}

@-webkit-keyframes fadeout {
    from {top: 30px; opacity: 1;}
    to {top: 60px; opacity: 0;}
}

@keyframes fadeout {
    from {top: 30px; opacity: 1;}
    to {top: 60px; opacity: 0;}
}
</style>
