<template>
    <div id="main">
        <div id="desc">
            <img src="../assets/logo.png" alt="vue logo" srcset="">
            <h1>A spotify web app made with vue.</h1>
            <p>- Based on ayanami rei.</p>
            <a class="waves-effect waves-wispy btn-flat" id="connect" @click="sendToSpotify">
                <i class="material-icons left">headset</i>Connect with spotify
            </a>
        </div>
    </div>
</template>

<script>
import props from '../props';

export default {
    methods: {
        sendToSpotify() {
            window.location.replace(`https://accounts.spotify.com/authorize?client_id=${props.clientId}&response_type=code&redirect_uri=${props.redirectURI}&scope=${props.scope}`);
        }
    }
}
</script>

<style scoped>
#main {
    display: flex;
    justify-content: center;
    align-items: center;
}
#desc {
    width: 29%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
#connect {
    margin-top: 4%;
}
h1 {
    color: #333333;
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: normal;
    margin-bottom: 0;
    text-align: center;
}
p {
    margin-top: 1%;
    text-align: right;
    padding-right: 2%;
    width: 100%;
    text-align: right;
}
</style>