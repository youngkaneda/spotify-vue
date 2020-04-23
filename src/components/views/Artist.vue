<template>
    <div>
        <div class="header">
            <img class="artist-image" :src="artist.images ? artist.images[1].url : null" alt="" srcset="">
            <div class="desc">
                <p style="margin: 0; font-size: 90%">ARTIST</p>
                <h3 style="margin: 0.5% 0% 0.5% 0%">{{ artist.name }}</h3>
                <p style="margin: 0; font-size: 90%">
                    FOLLOWERS: 
                    <span style="margin: 0; font-size: 110%">{{ artist.followers ? artist.followers.total : 0 }}</span>
                </p>
            </div>
        </div>
        <br>
        <h5>Top Tracks</h5>
        <div class="table">
            <table>
                <tbody>
                    <tr v-for="track in topTracks" :key="track.id">
                        <td style="width: 3%;"> 
                            <i style="cursor: pointer;" class="material-icons left waves-wispy" 
                                :style="[track.id === currentTrack.id || isLinkedFrom(track.id) ? {color: '#1b7cde'} : {}]"
                                @click="togglePlayTrack(track)"
                            >
                                {{ (track.id === currentTrack.id || isLinkedFrom(track.id)) && currentTrack.is_playing ? 'pause' : 'play_arrow'}}
                            </i>
                        </td>
                        <td style="width: 4%;"> 
                            <i style="cursor: pointer;" class="material-icons left waves-wispy" @click="addToQueue(track)">add_to_queue</i> 
                        </td>
                        <td>
                            <span :style="[track.id === currentTrack.id || isLinkedFrom(track.id) ? {color: '#1b7cde'} : {}]">{{ track.name }}</span> 
                            - 
                            <span style="color: gray">{{ track.artists ? track.artists.map(el => el.name).join(', ') : null }}</span>
                        </td>
                        <td style="width: 3%">{{ getTimeDisplay(track.duration_ms) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h5>Albums</h5>
        <div class="albums">
            <div class="album" v-for="album in albums" :key="album.id" @click="openAlbum(album)">
                <img class="album-img" :src="album.images ? album.images[1].url : null" alt="">
                <p style="width: 100; text-align: center; margin-top: 1%; margin-bottom: 2%">{{ album.name }}</p>
            </div>
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
import props from '../../props';
import axios from 'axios';

export default {
    data() {
        return {
            artist: {},
            topTracks: [],
            albums: [],
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
        axios.get(`${props.api}/artists/${this.$route.query.id}`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            },
        })
        .then((response) => {
            this.artist = response.data;
        });
        axios.get(`${props.api}/artists/${this.$route.query.id}/top-tracks?country=US`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            },
        })
        .then((response) => {
            this.topTracks = response.data.tracks;
        });
        axios.get(`${props.api}/artists/${this.$route.query.id}/albums?offset=0&limit=7&include_groups=album&market=US`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            },
        })
        .then((response) => {
            this.albums = response.data.items;
        });
    },
    methods: {
        isLinkedFrom(id) {
            let linkedFrom = this.currentTrack.linked_from;
            return linkedFrom ? linkedFrom.id === id : false;
        },
        togglePlayTrack(track) {
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
        addToQueue(track) {
            axios.post(`${props.api}/me/player/queue?device_id=${this.deviceId}&uri=${track.uri}`, null, {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                }
            )
            .then((response) => {
                this.$store.commit('addToQueue', track);
                console.log(track);
                this.launchToast();
            });
        },
        launchToast() {
            var x = document.getElementById('toast')
            x.className = 'show';
            setTimeout(function(){ x.className = x.className.replace('show', ''); }, 3000);
        },
        openAlbum(album) {
            this.$router.push({ path: '/browse/album', query: { id: album.id } });
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
.artist-image {
    width: 19%;
    margin-top: 1.7%;
}
.header {
    display: flex;
    flex-direction: row;
}
.desc {
    margin-top: 14.9%;
    margin-left: 1%;
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
.album {
    margin-left: 1%;
    display: inline-block;
}
.album:hover {
    cursor: pointer;
}
.album:hover .album-img {
    opacity: 0.8;
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
    padding-left: 4%;
    padding-right: 3%;
    padding-top: 4%;
    padding-bottom: 3%;
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
