const
    debug = require('debug')('hbauth:login'),
    router = require('express').Router(),
    bcrypt = require('bcrypt'),
    knex = require('../db/knex');

module.exports = () => {

    login();
    return router;

};

function login() {

    router.route('/login')

        .all((req, res) => {

            const login = req.body.login || req.query.login;
            const password = req.body.password || req.query.password;

            debug(login, password);
            res.status(200).json({login, password});

        })

}