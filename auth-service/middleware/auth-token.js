module.exports = function(req, res, next) {
    const token = req.headers['token'];
    if (!token || token !== process.env.AUTH_TOKEN) {
        return res.status(401).json({ status: 401, message: 'Unauthorized: Invalid token' });
    }
    next();
};
