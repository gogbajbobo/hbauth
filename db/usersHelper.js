const
    debug = require('debug')('hbauth:usersHelpers'),
    bcrypt = require('bcrypt');

let db;

module.exports = (knex) => {

    db = knex;

    return {
        getUserFromCrentials
    };
};

function getUserFromCrentials(username, password) {

    debug('getUserFromCrentials');

    return new Promise(() => {

        bcrypt.hash(password, 10, (err, hash) => {

            if (err) throw err;

            const users = db('users');
            return users.select().where({username, hash})
                .then(user => user)
                .catch(err => err);

        });

    });

}