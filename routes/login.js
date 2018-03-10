const
    debug = require('debug')('hbauth:login'),
    router = require('express').Router(),
    bcrypt = require('bcrypt'),
    users = require('../db/knex')('users'),
    _ = require('lodash');

module.exports = () => {

    login();
    return router;

};

function login() {

    router.route('/login')

        .all((req, res) => {

            const login = req.body.login || req.query.login;
            const password = req.body.password || req.query.password;

            debug('login user:', login, 'and password:', password);

            if (!login || !password) {
                return res.status(400).send();
            }

            users.select('hash').where('login', login)
                .then(result => {

                    const hash = _.first(_.flatMap(result, obj => _.values(obj)));

                    if (!hash) {
                        return res.status(401).json({error: true, message: 'login unauthorized'});
                    }

                    bcrypt.compare(password, hash, (err, success) => {

                        if (!err && success) {
                            res.status(200).json({login, password, hash, message: 'login success'});
                        } else {
                            res.status(401).json({error: true, message: 'login unauthorized'});
                        }

                    });

                });

        })
    
}