const fs = require('fs');

fs.writeFileSync(
    './.env',
    `VUE_APP_REDIRECT_URI=${process.env.REDIRECT_URI}\nVUE_APP_CLIENT_SECRET=${process.env.CLIENT_SECRET}\nVUE_APP_CLIENT_ID=${process.env.CLIENT_ID}\n`,
);
