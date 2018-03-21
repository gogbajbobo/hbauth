const winston = require('winston');

function getLogger(module) {

    const path = module.filename.split('/').slice(-2).join('/'); //using filename in log statements

    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'silly',
                label:      path
            })
        ]
    });

}

module.exports = getLogger;