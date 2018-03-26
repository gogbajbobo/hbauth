const
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('../db/models/User'),
    log = require('../log/logger')(module),
    config = require('../config/config');

passport.use(User.createStrategy());

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt:secretKey')
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {

    // first I have to check if jwt in my db (Redis or something)

    const expirationDate = new Date(jwtPayload.exp * 1000);
    if (expirationDate < new Date()) {
        return done(null, false);
    }

    User.findByUsername(jwtPayload.username, (err, user) => {
        return done(null, user || false);
    });

}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
