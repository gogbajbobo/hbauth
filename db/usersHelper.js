let db;

module.exports = (knex) => {

    db = knex;

    return {
        findByUsername,
        findById
    }

};


function findByUsername(username, cb) {

    return cb(null, false);

    // db.users.findByUsername(username, (err, user) => {
    //
    //     if (err) { return cb(err); }
    //     if (!user) { return cb(null, false); }
    //     if (user.password != password) { return cb(null, false); }
    //     return cb(null, user);
    //
    // });

}

function findById(userId, cb) {

    return cb(null, {});

    // db.users.findById(id, (err, user) => {
    //
    //     if (err) { return cb(err); }
    //     cb(null, user);
    //
    // });

}