


const { Client } = require('pg');
require('dotenv').config();

const dbUrl = process.env.connectionString;

//console.log("DATABASE URL:", dbUrl);

const pgClient = new Client({
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

pgClient.connect()
    .then(() => {
        console.log('db started');
    })
    .catch((e) => {
        console.log("DB CONNECTION ERROR:");
        console.log(e);
    });

module.exports = pgClient;
