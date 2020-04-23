<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: 'App',
    data() {
        return {
        };
    },
    created() {
        window.onSpotifyWebPlaybackSDKReady = () => {};
    }
};
</script>

<style scoped></style>
