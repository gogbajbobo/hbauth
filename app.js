const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    requestLogger = require('morgan'),
    log = require('./log/logger')(module),
    config = require('./config/config'),
    passport = require('./auth/passport'),
    path = require('path');
    // login = require('connect-ensure-login');

require('./db/mongoose');

app.use(requestLogger('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
    name: 'hbauth.session.id',
    secret: 'mouse dog',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.all('/*', (req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }

});

const routes = require('./routes/routes');
app.use(routes);

const apiRoute = require('./routes/apiRoute');
app.use('/api', apiRoute);
// app.use('/api', login.ensureLoggedIn(), apiRoute);

const port = process.env.PORT || config.get('port');
app.listen(port, () => {
    log.info('HomeBudget RESTful API server started on:', port);
});
