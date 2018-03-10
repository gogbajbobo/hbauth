const
    debug = require('debug')('hbauth:app'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const validator = require('./routes/check');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(validator);

const port = 8887;
app.listen(port, () => {
    debug('HomeBudget Auth server started on: ' + port);
});
