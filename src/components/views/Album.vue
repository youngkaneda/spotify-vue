<template>
    <div>
        <div class="header">
            <img class="album-image" :src="album.images ? album.images[1].url : null" alt="" srcset="">
            <div class="desc">
                <p style="margin: 0; font-size: 90%">ALBUM</p>
                <h3 style="margin: 0.5% 0% 0.5% 0%">{{ album.name }}</h3>
                <p style="margin: 0;">by <a class="link">{{ album.artists ? album.artists.map(el => el.name).join(', ') : null }}</a></p>
            </div>
        </div>
        <br>
        <div class="table">
            <table>
                <tbody>
                    <tr v-for="track in (album.tracks ? album.tracks.items : [])" :key="track.id">
                        <td style="width: 3%;"> 
                            <i style="cursor: pointer;" class="material-icons left waves-wispy volumeIcon">play_arrow</i>
                        </td>
                        <td style="width: 4%;"> 
                            <i style="cursor: pointer;" class="material-icons left waves-wispy volumeIcon">add_to_queue</i> 
                        </td>
                        <td>{{ track.name }} - <span style="color: gray">{{ album.artists ? album.artists.map(el => el.name).join(', ') : null }}</span></td>
                        <td style="width: 3%">{{ getTimeDisplay(track.duration_ms) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import props from '../../props';
import axios from 'axios';

export default {
    data() {
        return {
            album: {},
        };
    },
    beforeMount() {
        axios.get(`${props.api}/albums/${this.$route.query.id}`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
            },
        })
        .then((response) => {
            console.log(response.data);
            this.album = response.data;
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
.album-image {
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
</style>