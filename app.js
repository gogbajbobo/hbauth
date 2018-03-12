const
    debug = require('debug')('hbauth:app'),
    express = require('express'),
    app = express(),
    router = express.Router(),
    knex = require('./db/config/knex'),
    usersDbHelper = require('./db/usersHelper')(knex),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Strategy = require('passport-local').Strategy,
    passportHelper = require('./auth/passport/passportHelper')(usersDbHelper);

passport.use(new Strategy(passportHelper.passportLocalVerify));
passport.serializeUser(passportHelper.serializeUser);
passport.deserializeUser(passportHelper.deserializeUser);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

const
    // register = require('./routes/register')(router, app, knex),
    // login = require('./routes/login')(router, app, knex),
    validator = require('./routes/check');

// app.use(register);
// app.use(login);
app.use('/login',
    passport.authenticate('local', { failureRedirect: '/register' }),
    (req, res) => {
        res.redirect('/');
    });

app.use(validator);

const port = 8887;
app.listen(port, () => {
    debug('HomeBudget Auth server started on: ' + port);
});
