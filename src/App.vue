<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        created() {
            window.onSpotifyWebPlaybackSDKReady = () => { };
        }
    };
</script>

<style></style>
