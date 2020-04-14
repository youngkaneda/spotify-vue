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
