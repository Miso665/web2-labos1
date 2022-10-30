const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'web2-lab1',
    password: 'bazepodataka',
    port: 5432,
});

// ADD if needed