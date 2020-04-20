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
                            <i style="cursor: pointer;" class="material-icons left waves-wispy volumeIcon">play_arrow</i>
                        </td>
                        <td style="width: 4%;"> 
                            <i style="cursor: pointer;" class="material-icons left waves-wispy volumeIcon">add_to_queue</i> 
                        </td>
                        <td>{{ track.name }} - <span style="color: gray">{{ track.artists ? track.artists.map(el => el.name).join(', ') : null }}</span></td>
                        <td style="width: 3%">{{ getTimeDisplay(track.duration_ms) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h5>Albums</h5>
        <div class="albums">
            <div class="album" v-for="album in albums" :key="album.id">
                <img class="album-img" :src="album.images ? album.images[1].url : null" alt="">
                <p style="width: 100; text-align: center; margin-top: 1%; margin-bottom: 2%">{{ album.name }}</p>
            </div>
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
</style>
