const { Pool } = require('pg');

const dbConnect = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DBNAME
})