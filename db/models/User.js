const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    timestamps = require('./plugins/timestamps');

const User = new Schema({
    role: {
        type: String,
        default: 'user'
    }
});

User.plugin(passportLocalMongoose, {
    limitAttempts: true,
    populateFields: '-hash'
});

User.plugin(timestamps);

module.exports = mongoose.model('User', User);
