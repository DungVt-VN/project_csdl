const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'project',
    password: '1',
    port: 5432,
});

client.connect();
module.exports.myconnection = client;
