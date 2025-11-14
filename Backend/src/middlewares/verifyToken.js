const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

// user verification: checking token and block status
// this function will check
// does user has token ? if yes, then if it is valid or not, if valid then check if it is not in a block list.
const verifyToken = async (req, res, next) => {
    try{
        // 1) Try cookie first
        let { token } = req.cookies || {};

        // 2) Fallback to Authorization header: "Bearer <token>"
        if (!token) {
            const authHeader = req.headers["authorization"] || req.headers["Authorization"];
            if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        // 3) Fallback to x-access-token header (legacy/support)
        if (!token) {
            const xToken = req.headers["x-access-token"];
            if (xToken && typeof xToken === "string") token = xToken;
        }

        // 4) Dev-only bypass to unblock local admin portal when needed
        const isProd = process.env.NODE_ENV === 'production';
        if (!token && !isProd && process.env.DEV_ADMIN_SECRET && req.headers['x-dev-admin'] === process.env.DEV_ADMIN_SECRET) {
            // Minimal payload granting admin access for local development only
            req.payload = { _id: "dev-admin", username: "dev_admin", emailId: "dev@local", role: "admin" };
            return next();
        }

        if (!token)
            throw new Error("Absence of Token");

        // verifying token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        
        // check if token is blocked or not
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked)
            throw new Error("Invalid Token");

        // adding payload in req object
        req.payload = payload;

        next();
    } catch(error) {
        res.status(401).send("Error: "+error.message);
    }   
}

module.exports = verifyToken;