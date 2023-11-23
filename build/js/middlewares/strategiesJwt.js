"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function JWTMiddlewareAssigner(req, res, next) {
    if (!req.user)
        return res.status(404).json({ err: "User does not exist" });
    const user = req.user;
    const accessToken = jsonwebtoken_1.default.sign({ "userId": user.id, "role": user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15 * 60 * 1000 });
    const refreshToken = jsonwebtoken_1.default.sign({ "userId": user.id, "role": user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1 day" });
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    next();
}
exports.default = JWTMiddlewareAssigner;
