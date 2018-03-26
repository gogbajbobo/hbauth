const
    mongoose = require('mongoose'),
    log = require('../log/logger')(module),
    config = require('../config/config');

mongoose.connect(config.get('mongoose:uri'));
const db = mongoose.connection;

db.on('error', err => {
    log.error('connection error:', err.message);
});
db.once('open', () => {
    log.info("Connected to DB!");
});
