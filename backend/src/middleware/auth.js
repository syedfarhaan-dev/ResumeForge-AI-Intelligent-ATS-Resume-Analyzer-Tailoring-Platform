const env = require("../config/env");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

async function requireAuth(req, res, next){
    try {
        const token = req.cookies[env.cookieName];
        if (!token) throw ApiError.unauthorized();

        const payload = verifyToken(token);
        const user = await User.findById(payload.sub);
        if (!user) throw ApiError.unauthorized("session no longer valid");

        req.user = user;
        next();
    }catch(err){
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"){
            return next(ApiError.unauthorized("Invalid or Expired session"));
        }
        next(err);
    }
}


module.exports = {requireAuth};

