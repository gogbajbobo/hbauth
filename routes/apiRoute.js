const
    proxy = require('http-proxy').createProxyServer(),
    config = require('../config/config');


const apiRoute = (req, res, next) => {

    proxy.web(req, res, {
        target: config.get('api:host') + ":" + config.get('api:port')
    }, next);

};

module.exports = apiRoute;
