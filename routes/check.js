const
    debug = require('debug')('hbauth:app');

const validator = (req, res, next) => {

    debug('authorization token:', req.headers.authorization);

    if (req.headers.authorization === 'Bearer authKey_12345') {

        debug('ok — 200');
        res.status(200).send();

    } else {

        debug('not ok — 403');
        res.status(403).send({error: 'forbidden'});

    }

    return next();

};

module.exports = validator;