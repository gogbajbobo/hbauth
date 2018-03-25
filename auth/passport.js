const
    passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('../db/models/User'),
    log = require('../log/logger')(module),
    config = require('../config/config');

passport.use(User.createStrategy()); // this is local strategy

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt:secretKey')
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {

    log.info(jwtPayload);

    const expirationDate = new Date(jwtPayload.exp * 1000);
    if (expirationDate < new Date()) {
        return done(null, false);
    }

    done(null, jwtPayload);

    //
    // User.findOne({id: jwtPayload.sub}, (err, user) => {
    //
    //     if (err) { return done(err, false); }
    //
    //     // return done(null, user || false);
    //
    //     // return done(null, user ? user : false);
    //
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    //
    // });

}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;