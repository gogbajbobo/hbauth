const
    debug = require('debug')('hbauth:register'),
    router = require('express').Router(),
    bcrypt = require('bcrypt'),
    users = require('../db/knex')('users'),
    uuidv4 = require('uuid/v4'),
    _ = require('lodash');

module.exports = () => {

    register();
    return router;

};

function register() {

    router.route('/register')

        .all((req, res) => {

            const login = req.body.login || req.query.login;
            const password = req.body.password || req.query.password;

            debug('trying to register user with login:', login, 'and password:', password);

            if (!login || !password) {
                return res.status(400).send();
            }

            users.select('login')
                .then(result => {

                    const logins = _.flatMap(result, obj => _.values(obj));

                    if (_.includes(logins, login)) {
                        return res.status(400).json({error: true, message: 'login already taken'});
                    }

                    bcrypt.hash(password, 10, (err, hash) => {

                        if (!err) {

                            users.insert({login, hash, xid: uuidv4()})
                                .then(result => {

                                    if (result) {
                                        res.status(200).json({login, password, hash});
                                    } else {
                                        res.status(500).send();
                                    }

                                })
                                .catch(() => {
                                    res.status(500).send();
                                });

                        } else {
                            res.status(500).send();
                        }

                    });

                });

        })

}