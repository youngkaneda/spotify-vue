<template>
    <div class="redirect"></div>
</template>

<script>
import axios from 'axios';
import props from '../props';

export default {
    created() {
        const params = new URLSearchParams(window.location.search);
        //
        let body = {
            grant_type: 'authorization_code',
            code: params.get('code'),
            redirect_uri: props.redirectURI,
            client_id: props.clientId,
            client_secret: props.clientSecret,
        };
        //
        this.$router.replace({'query': null});
        //
        const req = new URLSearchParams();
        //
        Object.keys(body).forEach(key => {
            req.set(key, body[key]);
        })
        //
        axios.post('https://accounts.spotify.com/api/token', req, {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
            },
        })
        .then((response) => {
            if(response.data.error === 'access_denied') {
                this.$router.push('/');
            }
            window.localStorage.setItem('spotify', JSON.stringify({...response.data}));
            // schedule access token refresh
            setInterval(() => {
                let spotify = JSON.parse(window.localStorage.getItem('spotify'));
                let req = new URLSearchParams();
                req.set('grant_type', 'refresh_token');
                req.set('refresh_token', spotify.refresh_token);
                axios.post('https://accounts.spotify.com/api/token', req, {
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded',
                        Authorization: 'Basic ' + btoa(`${props.clientId}:${props.clientSecret}`),
                    },
                })
                .then((response) => {
                    spotify.access_token = response.data.access_token;
                    window.localStorage.setItem('spotify', JSON.stringify(spotify));
                    //
                    this.$store.dispatch('rebuildPlayer');
                })
            }, 1000 * 60 * 55);
            //
            //redirect for a main page
            this.$router.push('/browse');
        })
        .catch((response) => {
            this.$router.push('/');
            //todo show a toast informing the error occured
        });
    },
};
</script>
