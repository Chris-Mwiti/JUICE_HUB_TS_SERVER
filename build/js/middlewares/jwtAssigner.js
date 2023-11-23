"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function JWTMiddlewareAssigner(req, res, next) {
    const accessTokenMaxAge = 15 * 60 * 1000;
    const refreshTokenMaxAge = 24 * 60 * 60 * 1000;
    //Checks if a refreshToken or accessToken already exists
    if (req.cookies && req.cookies.accessToken && req.cookies.refreshToken)
        return next();
    if (!req.user)
        return res.status(404).json({ err: "User does not exist" });
    const user = req.user;
    const accessToken = jsonwebtoken_1.default.sign({ "userId": user.id, "role": user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: accessTokenMaxAge });
    const refreshToken = jsonwebtoken_1.default.sign({ "userId": user.id, "role": user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenMaxAge });
    //Reassign a new accessToken if one has already expired by use of the refreshToken assigned
    if (!req.cookies.accessToken && req.cookies.refreshToken) {
        const decryptedRefreshToken = jsonwebtoken_1.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (typeof decryptedRefreshToken === 'string')
            return res.status(401).json({ err: "Unauthorized" });
        if ("userId" in decryptedRefreshToken && "role" in decryptedRefreshToken) {
            res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: accessTokenMaxAge });
            return next();
        }
    }
    else if (!req.cookies.refreshToken && req.cookies.accessToken) {
        //Client browser already has an accessToken
        return next();
    }
    else {
        res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: accessTokenMaxAge });
        res.cookie("refreshToken", refreshToken, { maxAge: refreshTokenMaxAge, httpOnly: true });
        next();
    }
}
exports.default = JWTMiddlewareAssigner;
