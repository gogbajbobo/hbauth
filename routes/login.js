const
    debug = require('debug')('hbauth:login'),
    bcrypt = require('bcrypt'),
    _ = require('lodash');

module.exports = (router, app, knex) => {

    login(router, app, knex);
    return router;

};

function login(router, app, knex) {

    router.route('/login')

        .all((req, res) => {

            const username = req.body.username || req.query.username;
            const password = req.body.password || req.query.password;

            debug('login user:', username, 'and password:', password);

            if (!username || !password) {
                return res.status(400).send();
            }

            const users = knex('users');

            users.select('hash').where('username', username)
                .then(result => {

                    const hash = _.first(_.flatMap(result, obj => _.values(obj)));

                    debug(hash);

                    if (!hash) {
                        return res.status(401).json({error: true, message: 'login unauthorized'});
                    }

                    bcrypt.compare(password, hash, (err, success) => {

                        if (!err && success) {
                            res.status(200).json({username, password, hash, message: 'login success'});
                        } else {
                            res.status(401).json({error: true, message: 'login unauthorized'});
                        }

                    });

                });

        })

}