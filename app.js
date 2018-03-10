const
    debug = require('debug')('hbauth:app'),
    express = require('express'),
    app = express();

const validator = require('./routes/check');

app.use(validator);

const port = 8887;
app.listen(port, () => {
    debug('HomeBudget Auth server started on: ' + port);
});
