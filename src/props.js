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
    clientId: 'f3e0e316044b4ec99a9c4645a9b48c97',
    clientSecret: '1c1c9b55075448a5809a1a679620a09b',
    redirectURI: 'http://localhost:8080/redirect',
    api: 'https://api.spotify.com/v1',
    scope: scopes.join(' '),
};
