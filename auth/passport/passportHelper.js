let usersDbHelper;

module.exports = (udbHelper) => {

    usersDbHelper = udbHelper;

    return {
        passportLocalVerify,
        serializeUser,
        deserializeUser
    }

};

function passportLocalVerify(username, password, cb) {

    usersDbHelper.findByUsername(username, (err, user) => {

        return cb(null, false);

        // db.users.findByUsername(username, (err, user) => {
        //
        //     if (err) { return cb(err); }
        //     if (!user) { return cb(null, false); }
        //     if (user.password != password) { return cb(null, false); }
        //     return cb(null, user);
        //
        // });

    });

}

function serializeUser(user, cb) {
    cb(null, user.id);
}

function deserializeUser(id, cb) {

    usersDbHelper.findById(id, (err, user) => {

        cb(err, user);
        // db.users.findById(id, (err, user) => {
        //
        //     if (err) { return cb(err); }
        //     cb(null, user);
        //
        // });

    });

}
