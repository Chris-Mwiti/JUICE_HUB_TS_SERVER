"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyJWT(req, res, next) {
    const cookies = req.cookies;
    if (!cookies || !cookies.accessToken || !cookies.refreshToken)
        return res.status(401).json({ err: "No cookies was found" });
    const decryptedToken = jsonwebtoken_1.default.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (typeof decryptedToken === "string")
        return res.status(500).json({ err: "Error while decrypting token" });
    if ("userId" in decryptedToken && "role" in decryptedToken) {
        req.user = {
            "userId": decryptedToken.userId,
            "role": decryptedToken.role
        };
        return next();
    }
    else {
        return res.status(401);
    }
}
exports.default = verifyJWT;
