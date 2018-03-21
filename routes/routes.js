const
    express = require('express'),
    router = express.Router(),
    log = require('../log/logger')(module),
    User = require('../db/models/User'),
    passport = require('../auth/auth'),
    login = require('connect-ensure-login');

router.route('/register')
    .get((req, res, next) => {

        res.status(404).json({
            error: true,
            message: 'register page is not ready yet'
        });

    })
    .post((req, res, next) => {

        const {username, password} = req.body;

        if (!username || !password) {

            log.error('both `username` and `password` are required');

            return res.status(400).json({
                error: true,
                message: 'both `username` and `password` are required'
            });

        }

        log.info('registering user', username);

        User.register(new User({username}), password, (err) => {

            if (err) {
                log.error('error while user register:', err.toLocaleString());
                return next(err);
            }

            log.info('user successfully registered');
            res.redirect('/');

        });

    });

router.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post(passport.authenticate('local', {failureRedirect: '/login'}), (req, res, next) => {
        res.redirect('/userinfo');
    });

router.route('/logout')
    .all((req, res, next) => {

        req.logout();
        res.redirect('/');

    });

router.route('/userinfo')
    .all(login.ensureLoggedIn(), (req, res, next) => {

        log.info(req.user);

        res.status(200).json({
            error: false,
            message: 'user info',
            data: {
                user: req.user
            }
        });

    });

module.exports = router;