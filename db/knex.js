const knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'localhost',
        user     : 'hbclient',
        password : 'hbclientpass',
        database : 'hbdb',
        charset  : 'utf8'
    }
});

module.exports = knex;