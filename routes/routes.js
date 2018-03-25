const
    express = require('express'),
    router = express.Router(),
    log = require('../log/logger')(module),
    User = require('../db/models/User'),
    passport = require('../auth/passport'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config'),
    login = require('connect-ensure-login');

router.route('/register')
    .get((req, res, next) => {
        res.render('register');
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
    .post(passport.authenticate(['local', 'jwt']), (req, res, next) => {
        res.redirect('/userinfo');
    });

router.route('/token')
    .post(passport.authenticate('local'), (req, res, next) => {

        const username = req.body.username;
        const password = req.body.password;
        const user = {
            'username': username,
            'role': 'admin'
        };
        console.log('login', user);

        const token = jwt.sign(user, config.get('jwt:secretKey'), { expiresIn: 3000 });
        // const refreshToken = randtoken.uid(256);
        // refreshTokens[refreshToken] = username;

        console.log('jwt', token);
        // console.log('refreshToken', refreshToken);
        // console.log('refreshTokens', refreshTokens);

        // res.json({token: 'Bearer ' + token, refreshToken: refreshToken});

        res.json({token: 'Bearer ' + token});

    });

router.route('/logout')
    .get((req, res, next) => {

        req.logout();
        res.redirect('/');

    });

router.route('/userinfo')
    .get(login.ensureLoggedIn(), (req, res, next) => {

        res.status(200).json({
            error: false,
            message: 'user info',
            data: {
                user: req.user
            }
        });

    });

module.exports = router;