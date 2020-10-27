<template>
    <div>
        <div class="album-info">
            <div class="profile--img">
                <img
                    class="album-image"
                    :src="album.images ? album.images[1].url : null"
                    :alt="album.name"
                />
            </div>

            <div class="album-info-meta">
                <div class="album-info-type">{{ album.type }}</div>
                <div class="album-info-name">{{ album.name }}</div>
                
                <div class="album-artist">
                    <figure
                        class="album-figure"
                        title="Linkin Park"
                        style="width: 24px; height: 24px"
                    >
                        <img
                            aria-hidden="false"
                            draggable="false"
                            loading="eager"
                            :src="album.images ? album.images[1].url : null"
                            :alt="album.name"
                            class="album-profile-img"
                        />
                    </figure>

                    <span>
                        <a
                            draggable="false"
                            class="link"
                            v-for="artist in album.artists"
                            :key="artist.id"
                            @click="openArtist(artist)"
                            >{{ artist.name }}</a
                        >
                    </span>
                    •
                    <span class="album-total-tracks">
                        {{ totalTracks(album.total_tracks) }}
                    </span>
                </div>
            </div>
        </div>
        <br />
        <div class="table">
            <table>
                <tbody>
                    <tr
                        v-for="track in album.tracks ? album.tracks.items : []"
                        :key="track.id"
                    >
                        <td style="width: 3%">
                            <i
                                style="cursor: pointer"
                                class="material-icons left waves-wispy"
                                :style="[
                                    track.id === currentTrack.id ||
                                    isLinkedFrom(track.id)
                                        ? { color: '#1b7cde' }
                                        : {},
                                ]"
                                @click="togglePlayTrack(track)"
                            >
                                {{
                                    (track.id === currentTrack.id ||
                                        isLinkedFrom(track.id)) &&
                                    currentTrack.is_playing
                                        ? "pause"
                                        : "play_arrow"
                                }}
                            </i>
                        </td>
                        <td style="width: 4%">
                            <i
                                style="cursor: pointer"
                                class="material-icons left waves-wispy"
                                @click="addToQueue(track)"
                            >
                                add_to_queue
                            </i>
                        </td>
                        <td>
                            <span
                                :style="[
                                    track.id === currentTrack.id ||
                                    isLinkedFrom(track.id)
                                        ? { color: '#1b7cde' }
                                        : {},
                                ]"
                                >{{ track.name }}</span
                            >
                            -
                            <span style="color: gray">{{
                                track.artists
                                    ? track.artists
                                          .map((el) => el.name)
                                          .join(", ")
                                    : null
                            }}</span>
                        </td>
                        <td style="width: 3%">
                            {{ getTimeDisplay(track.duration_ms) }}
                        </td>
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
import axios from "axios";
import props from "../props";

export default {
    data() {
        return {
            album: {},
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
        axios
            .get(`${props.api}/albums/${this.$route.query.id}`, {
                headers: {
                    Authorization: `Bearer ${
                        JSON.parse(window.localStorage.getItem("spotify"))
                            .access_token
                    }`,
                },
            })
            .then((response) => {
                this.album = response.data;
            });
    },
    methods: {
        isLinkedFrom(id) {
            const linkedFrom = this.currentTrack.linked_from;
            return linkedFrom ? linkedFrom.id === id : false;
        },
        togglePlayTrack(track) {
            if (
                track.id === this.currentTrack.id ||
                this.isLinkedFrom(track.id)
            ) {
                if (this.currentTrack.is_playing) {
                    axios.put(
                        `${props.api}/me/player/pause?device_id=${this.deviceId}`,
                        null,
                        {
                            headers: {
                                Authorization: `Bearer ${
                                    JSON.parse(
                                        window.localStorage.getItem("spotify")
                                    ).access_token
                                }`,
                            },
                        }
                    );
                } else {
                    axios.put(
                        `${props.api}/me/player/play?device_id=${this.deviceId}`,
                        null,
                        {
                            headers: {
                                Authorization: `Bearer ${
                                    JSON.parse(
                                        window.localStorage.getItem("spotify")
                                    ).access_token
                                }`,
                            },
                        }
                    );
                }
            } else {
                axios.put(
                    `${props.api}/me/player/play?device_id=${this.deviceId}`,
                    {
                        uris: [track.uri],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${
                                JSON.parse(
                                    window.localStorage.getItem("spotify")
                                ).access_token
                            }`,
                        },
                    }
                );
            }
        },
        addToQueue(track) {
            axios
                .post(
                    `${props.api}/me/player/queue?device_id=${this.deviceId}&uri=${track.uri}`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                JSON.parse(
                                    window.localStorage.getItem("spotify")
                                ).access_token
                            }`,
                        },
                    }
                )
                .then((response) => {
                    //
                    track.album = { name: this.album.name };
                    //
                    this.$store.commit("addToQueue", track);
                    this.launchToast();
                });
        },
        launchToast() {
            const x = document.getElementById("toast");
            x.className = "show";
            setTimeout(() => {
                x.className = x.className.replace("show", "");
            }, 3000);
        },
        openArtist(artist) {
            this.$router.push({
                path: "/browse/artist",
                query: { id: artist.id },
            });
        },
        getTimeDisplay(ms) {
            let seconds = (ms / 1000).toFixed(0);
            let minutes = Math.floor(seconds / 60);
            let hours = "";
            if (minutes > 59) {
                hours = Math.floor(minutes / 60);
                hours = hours >= 10 ? hours : `0${hours}`;
                minutes = Math.floor(minutes % 60);
                minutes = minutes >= 10 ? minutes : `0${minutes}`;
            }
            seconds = Math.floor(seconds % 60);
            seconds = seconds >= 10 ? seconds : `0${seconds}`;
            if (hours != "") {
                return `${hours}:${minutes}:${seconds}`;
            }
            return `0${minutes}:${seconds}`;
        },
        totalTracks(totalTracks) {
            return totalTracks > 1
                ? `${totalTracks} musics`
                : `${totalTracks} music`;
        },
    },
};
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
    left: 0;
    right: 0;
    top: 30px;
    font-size: 17px;
    white-space: nowrap;
}
#toast #img {
    width: 50px;
    height: 50px;
    float: left;
    padding: 13px;
    box-sizing: border-box;
    background-color: #111;
    color: #fff;
}
#toast #desc {
    color: #fff;
    padding: 3%;
    margin-top: 0;
    overflow: hidden;
    white-space: nowrap;
}

#toast.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 2s,
        fadeout 0.5s 2.5s;
    animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 4s,
        fadeout 0.5s 4.5s;
}

@-webkit-keyframes fadein {
    from {
        top: 0;
        opacity: 0;
    }
    to {
        top: 30px;
        opacity: 1;
    }
}

@keyframes fadein {
    from {
        top: 0;
        opacity: 0;
    }
    to {
        top: 30px;
        opacity: 1;
    }
}

@-webkit-keyframes expand {
    from {
        min-width: 50px;
    }
    to {
        min-width: 350px;
    }
}

@keyframes expand {
    from {
        min-width: 50px;
    }
    to {
        min-width: 350px;
    }
}
@-webkit-keyframes stay {
    from {
        min-width: 350px;
    }
    to {
        min-width: 350px;
    }
}

@keyframes stay {
    from {
        min-width: 350px;
    }
    to {
        min-width: 350px;
    }
}
@-webkit-keyframes shrink {
    from {
        min-width: 350px;
    }
    to {
        min-width: 50px;
    }
}

@keyframes shrink {
    from {
        min-width: 350px;
    }
    to {
        min-width: 50px;
    }
}

@-webkit-keyframes fadeout {
    from {
        top: 30px;
        opacity: 1;
    }
    to {
        top: 60px;
        opacity: 0;
    }
}

@keyframes fadeout {
    from {
        top: 30px;
        opacity: 1;
    }
    to {
        top: 60px;
        opacity: 0;
    }
}

.album-info {
    padding: 15px;
    z-index: 1;
    width: 80%;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-end;
}
.album-info .profile--img {
    margin-right: 15px;
}
.album-info .profile--img img {
    width: 150px;
    height: 150px;
}
.album-info-type {
    color: #aaaaaa;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
}
.album-info-name {
    color: black;
    font-size: 36px;
    font-weight: 100;
    padding: 0 0 10px 0;
}
.album-followers {
    width: 20%;
    z-index: 1;
    padding: 15px;
    text-align: right;
    color: #aaaaaa;
    font-weight: 100;
    font-size: 16px;
    letter-spacing: 1px;
}
.album-followers-label {
    font-weight: 300;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
}

@media (max-width: 522px) {
    .album-info {
        margin-top: 0;
        width: 100%;
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        text-align: center;
    }
    .album-info .profile--img {
        margin-right: 0;
    }
    .album-info-type {
        margin-top: 10px;
    }
}

.album-artist {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    /* margin-top: 8px; */
}

.album-figure {
    overflow: hidden;
    position: relative;
    display: inline-block;
    margin-right: 4px;
    margin-left: 4px;
}

.album-profile-img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
}
</style>
