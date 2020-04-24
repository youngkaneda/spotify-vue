const fs = require('fs');

fs.writeFileSync(
    './.env',
    `REDIRECT_URI=${process.env.REDIRECT_URI}\nCLIENT_SECRET=${process.env.CLIENT_SECRET}\nCLIENT_ID=${process.env.process.env.CLIENT_ID}\n`,
);
