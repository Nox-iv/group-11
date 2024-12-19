module.exports = {
    handleError: function handleError(res, message, status) {
        return res.status(status).json({ message });
    }
};