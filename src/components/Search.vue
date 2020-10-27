<template>
    <div>
        <div v-if="result.tracks">
            <h5 class="topic">Tracks</h5>
            <div class="row">
                <div
                    class="card waves-effect waves-light"
                    v-for="track in result.tracks.items"
                    :key="track.id"
                    @click="openAlbum(track.album)"
                >
                    <img
                        class="song-image"
                        :src="
                            track.album.images[1]
                                ? track.album.images[1].url
                                : 'https://i.imgur.com/o3lNa1A.png'
                        "
                        alt=""
                    />
                    <p class="name">{{ track.name }}</p>
                    <p class="artist">
                        {{ track.artists.map((el) => el.name).join(", ") }}
                    </p>
                    <a
                        class="btn-floating btn-large waves-effect waves-light play"
                        @click="togglePlay($event, track)"
                        :style="[
                            (track.id === currentTrack.id ||
                                isLinkedFrom(track.id)) &&
                                currentTrack.is_playing
                                ? { display: 'block !important' }
                                : {},
                        ]"
                    >
                        <i
                            v-if="
                                (track.id === currentTrack.id ||
                                    isLinkedFrom(track.id)) &&
                                    currentTrack.is_playing
                            "
                            class="material-icons"
                            style="font-size: 200%"
                        >
                            pause
                        </i>
                        <i
                            v-else
                            class="material-icons"
                            style="font-size: 200%"
                        >
                            play_arrow
                        </i>
                    </a>
                </div>
            </div>
        </div>
        <div v-if="result.albums">
            <h5 class="topic">Albums</h5>
            <div class="row">
                <div
                    class="card waves-effect waves-light"
                    v-for="album in result.albums.items"
                    :key="album.id"
                    @click="openAlbum(album)"
                >
                    <img
                        class="album-image"
                        :src="
                            album.images[1]
                                ? album.images[1].url
                                : 'https://i.imgur.com/o3lNa1A.png'
                        "
                        alt=""
                    />
                    <p class="name">{{ album.name }}</p>
                    <p class="artist">
                        {{ album.artists.map((el) => el.name).join(", ") }}
                    </p>
                </div>
            </div>
        </div>
        <div v-if="result.playlists">
            <h5 class="topic">Playlists</h5>
            <div class="row">
                <div
                    class="card waves-effect waves-light"
                    v-for="playlist in result.playlists.items"
                    :key="playlist.id"
                    @click="openPlaylist(playlist)"
                >
                    <img
                        class="playlist-image"
                        :src="
                            playlist.images[1]
                                ? playlist.images[1].url
                                : 'https://i.imgur.com/o3lNa1A.png'
                        "
                        alt=""
                    />
                    <p class="name">
                        {{
                            playlist.name && playlist.name !== " "
                                ? playlist.name
                                : "Untitled"
                        }}
                    </p>
                    <p class="owner">
                        {{
                            playlist.owner
                                ? playlist.owner.display_name
                                : "Untitled"
                        }}
                    </p>
                </div>
            </div>
        </div>
        <div v-if="result.artists">
            <h5 class="topic">Artists</h5>
            <div class="row">
                <div
                    class="card waves-effect waves-light"
                    v-for="artist in result.artists.items"
                    :key="artist.id"
                    @click="openArtist(artist)"
                >
                    <img
                        class="artist-image"
                        :src="
                            artist.images[1]
                                ? artist.images[1].url
                                : 'https://i.imgur.com/o3lNa1A.png'
                        "
                        alt=""
                    />
                    <p class="name">{{ artist.name }}</p>
                    <p class="artist">Artist</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../props';

export default {
    computed: {
        deviceId() {
            return this.$store.state.deviceId;
        },
        currentTrack() {
            return this.$store.state.currentTrack;
        },
        result() {
            return this.$store.state.searchResult;
        },
    },
    methods: {
        isLinkedFrom(id) {
            const linkedFrom = this.currentTrack.linked_from;
            return linkedFrom ? linkedFrom.id === id : false;
        },
        togglePlay(event, track) {
            event.stopPropagation();
            event.preventDefault();
            //
            if (
                track.id === this.currentTrack.id
                || this.isLinkedFrom(track.id)
            ) {
                if (this.currentTrack.is_playing) {
                    axios.put(
                        `${props.api}/me/player/pause?device_id=${this.deviceId}`,
                        null,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${
                                        JSON.parse(
                                            window.localStorage.getItem('spotify'),
                                        ).access_token}`,
                            },
                        },
                    );
                } else {
                    axios.put(
                        `${props.api}/me/player/play?device_id=${this.deviceId}`,
                        null,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${
                                        JSON.parse(
                                            window.localStorage.getItem('spotify'),
                                        ).access_token}`,
                            },
                        },
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
                            Authorization:
                                `Bearer ${
                                    JSON.parse(
                                        window.localStorage.getItem('spotify'),
                                    ).access_token}`,
                        },
                    },
                );
            }
        },
        openAlbum(album) {
            this.$router.push({
                path: '/browse/album',
                query: { id: album.id },
            });
        },
        openArtist(artist) {
            this.$router.push({
                path: '/browse/artist',
                query: { id: artist.id },
            });
        },
        openPlaylist(playlist) {
            this.$router.push({
                path: '/browse/playlist',
                query: { id: playlist.id },
            });
        },
    },
};
</script>

<style scoped>
p,
span {
    font-size: 105%;
}
.topic {
    margin-top: 1%;
    font-weight: bold;
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
.play {
    position: absolute;
    top: 72%;
    left: 60%;
    cursor: default;
    display: none;
    background-color: #a8c0d8;
}
.card:hover .play {
    display: block;
}
.name {
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
.artist,
.owner {
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
