const
    passport                = require('passport'),
    User                    = require('../db/models/User'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(User.createStrategy()); // this is local strategy?

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    issuer: 'accounts.examplesoft.com',
    audience: 'yoursite.net'
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {

    User.findOne({id: jwtPayload.sub}, (err, user) => {

        if (err) { return done(err, false); }

        // return done(null, user || false);

        // return done(null, user ? user : false);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }

    });

}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;