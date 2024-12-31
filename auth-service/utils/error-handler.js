module.exports = {
    handleError: function handleError(res, message, status = 500) {
        return res.status(status).json({ status, message });
    }
};
