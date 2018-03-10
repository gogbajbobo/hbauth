const
    debug = require('debug')('hbauth:app'),
    router = require('express').Router(),
    bcrypt = require('bcrypt');

module.exports = () => {

    register();
    return router;

};

function register() {

    router.route('/register')

        .all((req, res) => {

            const login = req.body.login || req.query.login;
            const password = req.body.password || req.query.password;

            debug(login, password);

            if (!login || !password) {

                res.status(400).send();
                return;

            }

            bcrypt.hash(password, 10, (err, hash) => {

                if (!err) {
                    res.status(200).json({login, password, hash});
                }

                res.status(500).send();

            });

        })

}