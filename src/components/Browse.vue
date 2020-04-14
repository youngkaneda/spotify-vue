<template>
    <div id="container">
        <div id="content" class="row">
            <div id="menu" class="col s2">
                <ul id="nav-mobile" class="sidenav sidenav-fixed" style="transform: translateX(0px);">
                    <li class="logo">
                        <img :src="this.profilePic" alt="" srcset="" class="profile-pic" width="62%" height="62%">
                        <p id="profile-name">{{ this.me.display_name }}</p>
                    </li>
                    <hr/>
                    <li class="bold topic"><a><i class="material-icons left">library_music</i> Your Library</a></li>
                    <li class="bold item"><a class="waves-effect waves-wispy"><i class="material-icons left">album</i> Albums</a></li>
                    <li class="bold item"><a class="waves-effect waves-wispy"><i class="material-icons left">mic</i> Artists</a></li>
                    <li class="bold item"><a class="waves-effect waves-wispy"><i class="material-icons left">format_list_bulleted</i> Playlists</a></li>
                </ul>
            </div>
            <div id="display" class="col s10">

            </div>
        </div>
        <Player></Player>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../props';
import Player from './Player';

export default {
    data() {
        return {
            me: {},
            profilePic: null,
            m: {},
        };
    },
    components: {
        Player,
    },
    beforeMount() {
        const spotify = JSON.parse(window.localStorage.getItem('spotify'));
        axios.get(`${props.api}/me`, {
            headers: {
                Authorization: 'Bearer ' + spotify.access_token,
            }
        })
        .then((response) => {
            this.me = response.data;
            this.profilePic = this.me.images[0].url;
        });
    },
}
</script>

<style scoped>
#menu {
    background-color: #F5F7F6;
}
#nav-mobile {
    z-index: -1 !important;
}
.profile-pic {
    border-radius: 50%;
}
.logo {
    padding-top: 5%;
    /* padding-bottom: 7%; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
#profile-name {
    margin: 0;
    width: 100%;
    text-align: center;
    font-size: 22px;
}
li a {
    font-weight: bold;
    font-size: 105%;
}
hr {
    width: 85%;
}
.topic a {
    font-size: 105%;
}
.item a {
    padding-left: 15%;
}
i {
    margin-right: 5% !important;
}
</style>
