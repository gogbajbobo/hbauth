const
    debug = require('debug')('hbauth:register'),
    router = require('express').Router(),
    bcrypt = require('bcrypt'),
    knex = require('../db/knex'),
    uuidv4 = require('uuid/v4');

module.exports = () => {

    register();
    return router;

};

function register() {

    router.route('/register')

        .all((req, res) => {

            const login = req.body.login || req.query.login;
            const password = req.body.password || req.query.password;

            debug('register user with login:', login, 'and password:', password);

            if (!login || !password) {

                res.status(400).send();
                return;

            }

            bcrypt.hash(password, 10, (err, hash) => {

                if (!err) {

                    knex('users').insert({login, hash, xid: uuidv4()})
                        .then(() => {
                            res.status(200).json({login, password, hash});
                        })
                        .catch(() => {
                            res.status(500).send();
                        });

                } else {
                    res.status(500).send();
                }

            });

        })

}