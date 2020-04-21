import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        queue: [],
        currentTrack: {},
        deviceId: null,
    },
    mutations: {
        updateCurrentTrack: (state, newTrack) => {
            // eslint-disable-next-line no-param-reassign
            state.currentTrack = newTrack;
        },
        addToQueue: (state, track) => {
            state.queue.push(track);
        },
        shiftQueue: (state) => {
            if (state.queue.length === 0) {
                return;
            }
            // eslint-disable-next-line no-param-reassign
            state.queue.shift();
        },
        setDeviceId: (state, deviceId) => {
            // eslint-disable-next-line no-param-reassign
            state.deviceId = deviceId;
        },
    },
});

export default store;
