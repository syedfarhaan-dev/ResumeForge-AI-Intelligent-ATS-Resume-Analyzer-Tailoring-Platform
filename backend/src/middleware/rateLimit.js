const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const ApiError = require("../utils/ApiError");

const analyzeLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: false,
    legacyHeaders: false,
    keyGenerator: (req, res) =>
        req.user?._id?.toString() ?? ipKeyGenerator(req, res),
    message: {
        error: "Too many requests. Please try again later.",
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req, res) => ipKeyGenerator(req, res),
    message: {
        error: "Too many auth attempts. Please try again later.",
    },
});

module.exports = { analyzeLimiter, authLimiter };