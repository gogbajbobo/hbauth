const
    debug = require('debug')('hbauth:register'),
    bcrypt = require('bcrypt'),
    uuidv4 = require('uuid/v4'),
    _ = require('lodash');

module.exports = (router, app, knex) => {

    register(router, app, knex);
    return router;

};

function register(router, app, knex) {

    router.route('/register')

        .all((req, res) => {

            const username = req.body.username || req.query.username;
            const password = req.body.password || req.query.password;

            debug('trying to register user with login:', username, 'and password:', password);

            if (!username || !password) {
                return res.status(400).send();
            }

            const users = knex('users');

            users.select('username')
                .then(result => {

                    const usernames = _.flatMap(result, obj => _.values(obj));

                    if (_.includes(usernames, username)) {
                        return res.status(400).json({error: true, message: 'login already taken'});
                    }

                    bcrypt.hash(password, 10, (err, hash) => {

                        if (!err) {

                            debug('insert user', {username, hash, xid: uuidv4()});

                            users.insert({username, hash, xid: uuidv4()})
                                .then(result => {

                                    if (result) {
                                        res.status(200).json({username, password, hash});
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