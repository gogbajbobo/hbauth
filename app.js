const
    debug = require('debug')('hbauth:app'),
    express = require('express'),
    app = express(),
    router = express.Router(),
    knex = require('./db/config/knex'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Strategy = require('passport-local').Strategy;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const
    register = require('./routes/register')(router, app, knex),
    login = require('./routes/login')(router, app, knex),
    validator = require('./routes/check');

app.use(register);
app.use(login);
app.use(validator);

const port = 8887;
app.listen(port, () => {
    debug('HomeBudget Auth server started on: ' + port);
});
