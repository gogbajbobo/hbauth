const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    requestLogger = require('morgan'),
    log = require('./log/logger')(module),
    config = require('./config/config'),
    passport = require('./auth/auth'),
    path = require('path'),
    login = require('connect-ensure-login');

mongoose.connect(config.get('mongoose:uri'));
const db = mongoose.connection;

db.on('error', err => {
    log.error('connection error:', err.message);
});
db.once('open', () => {
    log.info("Connected to DB!");
});

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

const routes = require('./routes/routes');
app.use(routes);

const apiRoute = require('./routes/apiRoute');
app.use('/api', login.ensureLoggedIn(), apiRoute);

const port = process.env.PORT || config.get('port');
app.listen(port, () => {
    log.info('HomeBudget RESTful API server started on:', port);
});
