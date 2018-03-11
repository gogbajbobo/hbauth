const
    debug = require('debug')('hbauth:app'),
    express = require('express'),
    app = express(),
    router = express.Router(),
    knex = require('./db/config/knex'),
    bodyParser = require('body-parser'),
    oAuthServer = require('oauth2-server'),
    accessTokensHelper = require('./db/accessTokensHelper')(knex),
    usersHelper = require('./db/usersHelper')(knex),
    oAuthModel = require('./db/models/oAuthModel')(accessTokensHelper, usersHelper);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.oauth = new oAuthServer({
    model: oAuthModel,
    grants: ['password'],
    debug: true
});

// app.use(app.oauth.errorHandler());

const register = require('./routes/register')(router, app, knex);
const login = require('./routes/login')(router, app, knex);
app.use(register);
app.use(login);

const validator = require('./routes/check');
app.use(validator);

const port = 8887;
app.listen(port, () => {
    debug('HomeBudget Auth server started on: ' + port);
});
