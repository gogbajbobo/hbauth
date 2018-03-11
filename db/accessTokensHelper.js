const debug = require('debug')('hbauth:accessTokensHelpers');

let db;

module.exports = (knex) => {

    db = knex;

    return {
        getUserIdFromAccessToken,
        saveAccessToken
    };
};

function getUserIdFromAccessToken(token) {

    debug('getUserIdFromAccessToken', token);

    const tokens = db('tokens');

    return tokens.select('user_id').where('accessToken', token)
        .then(result => {

            const userId = _.first(_.flatMap(result, obj => _.values(obj)));
            debug(userId);

            if (!userId) throw new Error();

            return userId;

        })
        .catch(() => {
            return null;
        });

}

function saveAccessToken(accessToken, user_id) {

    debug('saveAccessToken', accessToken, 'for userId', user_id);

    const tokens = db('tokens');

    const tokenObj = {accessToken, user_id};

    const insert = tokens.insert(tokenObj);
    const update = tokens.update(tokenObj);

    const query = insert.toString() + ' on duplicate key update ' + update.toString().replace(/^update ([`"])[^\1]+\1 set/i, '');

    return knex.raw(query);

}