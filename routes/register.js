const
    debug = require('debug')('hbauth:register'),
    bcrypt = require('bcrypt'),
    knex = require('../db/knex'),
    uuidv4 = require('uuid/v4'),
    _ = require('lodash');

module.exports = (router, app) => {

    register(router, app);
    return router;

};

function register(router, app) {

    router.route('/register')

        .all((req, res) => {

            const login = req.body.login || req.query.login;
            const password = req.body.password || req.query.password;

            debug('trying to register user with login:', login, 'and password:', password);

            if (!login || !password) {
                return res.status(400).send();
            }

            const users = knex('users');

            users.select('login')
                .then(result => {

                    const logins = _.flatMap(result, obj => _.values(obj));

                    if (_.includes(logins, login)) {
                        return res.status(400).json({error: true, message: 'login already taken'});
                    }

                    bcrypt.hash(password, 10, (err, hash) => {

                        if (!err) {

                            debug('insert user', {login, hash, xid: uuidv4()});

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

                })
                .catch(() => {
                    res.status(500).send();
                });

        })

}