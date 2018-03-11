const
    debug = require('debug')('hbauth:app'),
    express = require('express'),
    app = express(),
    router = express.Router(),
    knex = require('./db/knex'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.oauth = oauthserver({
//     model: {}, // See below for specification
//     grants: ['password'],
//     debug: true
// });

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
