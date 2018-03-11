let accessTokensHelper;
let usersHelper;

module.exports = (tokensHelper, uHelper) => {

    accessTokensHelper = tokensHelper;
    usersHelper = uHelper;

    return  {
        getAccessToken,
        getClient,
        grantTypeAllowed,
        saveAccessToken,
        getUser
    }

};

function getAccessToken(bearerToken, callback) {

    accessTokensHelper.getUserIdFromBearerToken(bearerToken)
        .then(userId => {

            const accessToken = {
                userId,
                expires: null
            };

            return callback(accessToken);

        })
        .catch(() => {
            return callback(null);
        });

}

function getClient(clientId, clientSecret, callback) {

    const client = {
        clientId,
        clientSecret,
        grants: null,
        redirectUris: null
    };

    callback(false, client);

}

function grantTypeAllowed(clientId, grantType, callback) {
    callback(false, true);
}

function saveAccessToken(accessToken, clientId, expires, user, callback) {

    accessTokensHelper.saveAccessToken(accessToken, user.id)
        .then(callback(null))
        .catch(callback(new Error()));

}

function getUser(username, password, callback) {

    usersHelper.getUserFromCrentials(username, password)
        .then(user => {
            callback(null, user);
        })
        .catch(err => {
            callback(err, null);
        });

}

