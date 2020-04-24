const scopes = [
    'user-read-playback-state',
    'streaming',
    'user-read-email',
    'playlist-read-collaborative',
    'user-modify-playback-state',
    'user-read-private',
    'playlist-modify-public',
    'user-library-modify',
    'user-top-read',
    'user-read-playback-position',
    'user-read-currently-playing',
    'playlist-read-private',
    'user-follow-read',
    'user-read-recently-played',
    'playlist-modify-private',
    'user-follow-modify',
    'user-library-read',
];

export default {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectURI: process.env.REDIRECT_URI,
    api: 'https://api.spotify.com/v1',
    scope: scopes.join(' '),
};
