/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        queue: [],
        currentTrack: {},
        deviceId: null,
        player: null,
        searchResult: {},
    },
    mutations: {
        updateCurrentTrack: (state, newTrack) => {
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
        setDeviceId: (state, deviceId) => {
            state.deviceId = deviceId;
        },
        setPlayer: (state, player) => {
            state.player = player;
        },
        setSearchResult: (state, result) => {
            state.searchResult = result;
        },
    },
});

export default store;
