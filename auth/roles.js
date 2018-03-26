const
    log = require('../log/logger')(module);

function requireRole(role) {

    return (req, res, next) => {

        if (req.user && req.user.role === role) return next();
        res.sendStatus(401);

    }

}

module.exports = requireRole;