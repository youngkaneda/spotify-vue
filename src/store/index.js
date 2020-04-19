import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        queue: [],
        currentTrack: {},
    },
    mutations: {
        updateCurrentTrack: (state, newTrack) => {
            // eslint-disable-next-line no-param-reassign
            state.currentTrack = newTrack;
        },
        shiftQueue: (state) => {
            // eslint-disable-next-line no-param-reassign
            state.queue = state.queue.shift();
        },
    },
});

export default store;
