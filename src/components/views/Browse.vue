<template>
    <div id="container">
        <div id="content" class="row">
            <div id="menu" class="col s2">
                <ul id="nav-mobile" class="sidenav sidenav-fixed" style="transform: translateX(0px);">
                    <li class="logo">
                        <img :src="this.profilePic" alt="" srcset="" class="profile-pic" width="62%" height="62%">
                        <p id="profile-name">{{ this.me.display_name }}</p>
                    </li>
                    <li class="bold">
                        <a class="waves-effect waves-wispy" style="font-size: 90%; font-weight: bold;" @click="() => {this.$router.push('/browse');}">
                            <i class="material-icons left">home</i> HOME
                        </a>
                    </li>                        
                    <li>
                        <input class="collapse-open" type="checkbox" id="collapse-3">
                        <label class="collapse-btn" for="collapse-3">
                            <li class="bold" @click="expandLibrary = expandLibrary === 'more' ? 'less' : 'more'">
                                <a>
                                    <i class="material-icons left">library_music</i> 
                                    <i class="material-icons left">{{ 'expand_' + expandLibrary }}</i>
                                    YOUR LIBRARY 
                                </a>
                            </li>
                        </label>
                        <div class="collapse-painel">
                            <div class="collapse-inner">
                                <li class="bold"><a class="waves-effect waves-wispy"><i class="material-icons left">album</i> Albums</a></li>
                                <li class="bold" @click="() => this.$router.push('/browse/artists')">
                                    <a class="waves-effect waves-wispy"><i class="material-icons left">mic</i> Artists</a>
                                </li>
                                <li class="bold"><a class="waves-effect waves-wispy"><i class="material-icons left">format_list_bulleted</i> Playlists</a></li>
                            </div>
                        </div>
                    </li>
                    <li>
                        <input class="collapse-open" type="checkbox" id="collapse-4" style="display: none">
                        <label class="collapse-btn" for="collapse-4">
                            <li class="bold" style="margin-top: 2%" @click="expandDevices = expandDevices === 'more' ? 'less' : 'more'">
                                <a>
                                    <i class="material-icons left">devices</i> 
                                    <i class="material-icons left">{{ 'expand_' + expandDevices }}</i>
                                    DEVICES
                                    <i class="material-icons right" @click="refreshDevices" id="refresh">refresh</i>
                                </a>
                            </li>
                        </label>
                        <div class="collapse-painel">
                            <div class="collapse-inner">
                                <li class="bold" v-for="device in devices" :key="device.id" @click="transferPlayback(device)">
                                    <a class="waves-effect waves-wispy" 
                                        :style="[device.is_active ? {color: '#1b7cde'} : {}, {textOverflow: 'ellipsis'},]"
                                    > 
                                        {{ device.name }} 
                                    </a>
                                </li>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div id="display" class="col s10">
                <router-view></router-view>
            </div>
        </div>
        <div id="player" class="row">
            <Player :activeDeviceId="activeDeviceId"></Player>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import props from '../../props';
import Player from './Player';

export default {
    data() {
        return {
            me: {},
            profilePic: null,
            devices: [],
            expandLibrary: 'more',
            expandDevices: 'more',
            activeDeviceId: null,
        };
    },
    components: {
        Player,
    },
    mounted() {
        const spotify = JSON.parse(window.localStorage.getItem('spotify'));
        axios.get(`${props.api}/me`, {
            headers: {
                Authorization: 'Bearer ' + spotify.access_token,
            },
        })
        .then((response) => {
            this.me = response.data;
            this.profilePic = this.me.images[0].url;
        });
        this.getDevices();
    },
    methods: {
        refreshDevices(event) {
            event.stopPropagation();
            event.preventDefault();
            this.getDevices();
        },
        getDevices() {
            axios.get(`${props.api}/me/player/devices`, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                },
            })
            .then((response) => {
                this.devices = response.data.devices;
            });
        },
        transferPlayback(device) {
            axios.put(`${props.api}/me/player`, 
                {
                    device_ids: [device.id,],
                    play: true,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(window.localStorage.getItem('spotify')).access_token,
                    },
                }
            )
            .then((response) => {
                // update devices
                setTimeout(() => {
                    this.getDevices();
                    //
                    this.activeDeviceId = device.id;
                }, 500);
            });
        }
    }
}
</script>

<style scoped>

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
label li a {
    font-weight: bold;
    font-size: 105%;
}
hr {
    width: 85%;
}
i {
    margin-right: 5% !important;
}
#refresh:hover {
    cursor: pointer;
    color: #1b7cde;
}
/*  */
.collapse-list {
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    border-bottom: 1px solid #e0e0e0;
}

.collapse-open {
    display: none;
}

.collapse-painel {
    visibility: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height .1s,
    visibility .3s,
    opacity .3s;
}

.collapse-open:checked ~ .collapse-painel {
    max-height: 100%;
    opacity: 100;
    visibility: visible
}

.collapse-list li {
    margin-bottom: 0;
}

.collapse-list .collapse-btn {
    border-top: 1px solid #e0e0e0;
    cursor: pointer;
    display: block;
    /* padding: 15px 10px; */
    margin-bottom: 0;
    /* color: #4285f4; */
    font-weight: bold;
    font-size: 105%;
    transition: background-color .2s ease;
}

.collapse-list .collapse-btn:hover {
    background: #eee;
}

.collapse-list .collapse-inner {
    padding: 10px
}
/*  */
#display {
    overflow: auto;
    max-height: 59em;
    /* padding-bottom: 0.8%; */
}
/*  */
#player {
    bottom: 0;
    position: fixed;
    margin: 0;
    padding: 0.2% 0% 0.3% 0%;
    width: 100%;
    background-color: #ededed;
    z-index: 999 !important;
}
</style>
