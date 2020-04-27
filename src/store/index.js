/* eslint-disable function-paren-newline */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';
import props from '../props';

Vue.use(Vuex);

const initialState = {
    queue: [],
    currentTrack: {},
    activeDeviceId: null,
    deviceId: null,
    player: null,
    searchResult: {},
    context: {},
};

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: initialState,
    mutations: {
        clear(state) {
            Object.assign(state, initialState);
        },
        currentTrack: (state, newTrack) => {
            state.currentTrack = newTrack;
        },
        addToQueue: (state, track) => {
            state.queue.push(track);
        },
        shiftQueue: (state) => {
            if (state.queue.length === 0) {
                return;
            }
            state.queue.shift();
        },
        skipQueueToTrack: (state, id) => {
            let index = null;
            state.queue.every((el, i) => {
                if (el.id === id) {
                    index = i;
                    return false;
                }
                return true;
            });
            state.queue.splice(0, index + 1);
        },
        activeDeviceId: (state, id) => {
            state.activeDeviceId = id;
        },
        deviceId: (state, id) => {
            state.deviceId = id;
        },
        player: (state, player) => {
            state.player = player;
        },
        searchResult: (state, result) => {
            state.searchResult = result;
        },
        context: (state, context) => {
            state.context = context;
        },
    },
    actions: {
        init(context) {
            context.dispatch('createPlayer').then(() => {
                context.dispatch('connectPlayer');
            });
        },
        async createPlayer(context) {
            async function waitForSpotifyWebPlaybackSDKToLoad() {
                return new Promise((resolve) => {
                    if (window.Spotify) {
                        resolve(window.Spotify);
                    } else {
                        window.onSpotifyWebPlaybackSDKReady = () => {
                            resolve(window.Spotify);
                        };
                    }
                });
            }
            //
            const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
            //
            return new Promise((resolve, reject) => {
                const token = JSON.parse(window.localStorage.getItem('spotify')).access_token;
                const player = new Player({
                    name: 'Vue Web SDK',
                    getOAuthToken: (cb) => { cb(token); },
                });
                // Error handling
                player.addListener('initialization_error', ({ message }) => { console.error(message); });
                player.addListener('authentication_error', ({ message }) => { console.error(message); });
                player.addListener('account_error', ({ message }) => { console.error(message); });
                player.addListener('playback_error', ({ message }) => { console.error(message); });
                // Playback status updates
                player.addListener('player_state_changed', (state) => {
                    if (!state) {
                        return;
                    }
                    //
                    context.commit('context', state);
                    context.commit('activeDeviceId', context.state.deviceId);
                    //
                    context.commit('currentTrack', {
                        ...state.track_window.current_track,
                        is_playing: !state.paused,
                    });
                    // update queue
                    // eslint-disable-next-line max-len
                    if (context.state.queue.length > 0 && context.state.queue[0].id === context.state.currentTrack.id) {
                        context.commit('shiftQueue');
                    }
                });
                // Ready
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    //
                    context.commit('deviceId', device_id);
                    // set default volume to the player;
                    player.setVolume(1).then(() => {
                        console.log('Volume updated.');
                    });
                });
                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });
                //
                context.commit('player', player);
                resolve();
            });
        },
        connectPlayer(context) {
            context.state.player.connect().then(() => {
                setTimeout(() => {
                    const active = context.state.activeDeviceId === context.state.deviceId;
                    if (active && context.state.activeDeviceId) {
                        axios.put(`${props.api}/me/player`,
                            {
                                device_ids: [context.state.deviceId],
                                play: !context.state.context.paused,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                                },
                            },
                        );
                    }
                }, 2000);
            });
        },
        rebuildPlayer(context) {
            const { paused } = context.state.context;
            const wasActive = context.state.activeDeviceId === context.state.deviceId;
            context.dispatch('createPlayer').then(() => {
                if (wasActive) {
                    axios.put(`${props.api}/me/player`,
                        {
                            // new device id
                            device_ids: [context.state.deviceId],
                            play: !paused,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('spotify')).access_token}`,
                            },
                        },
                    );
                }
            });
        },
    },
    modules: {
    },
});
