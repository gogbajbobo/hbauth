module.exports = schema => {

    schema.add({
        created: {
            type: Date,
            default: Date.now
        }
    });

};
