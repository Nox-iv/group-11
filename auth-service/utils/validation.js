module.exports = function validateSchema(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
        const message = error.details && error.details[0] ? error.details[0].message : 'Validation error';
        const err = new Error(message);
        err.status = 400;
        throw err;
    }
};
