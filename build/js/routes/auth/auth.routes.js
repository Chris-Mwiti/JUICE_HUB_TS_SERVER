"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_google_config_1 = __importDefault(require("../../config/passport-google-config"));
const jwtAssigner_1 = __importDefault(require("../../middlewares/jwtAssigner"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
const Register_controller_1 = __importDefault(require("../../controllers/auth/Register.controller"));
/**
 * Authentification Router
 *
 * Paths: "/login", "/logout", "/google", "/login/google", "/login/google/redirect", "/register"
 */
const AuthRouter = (0, express_1.Router)();
AuthRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registerController = new Register_controller_1.default(req, res);
    yield registerController.createUser();
}));
//Login route
AuthRouter.post('/login', verifyUser_1.default, jwtAssigner_1.default, (req, res) => {
    res.status(200).json({ msg: "Ok" });
});
// Logout route
AuthRouter.get("/logout", (req, res) => {
    res.send("You are being logged out");
});
//Google strategy login
AuthRouter.get("/login/google", passport_google_config_1.default.authenticate("google", {
    scope: ["email", "profile"],
}));
//Google callback redirect url
AuthRouter.get("/login/google/redirect", passport_google_config_1.default.authenticate("google"), jwtAssigner_1.default, (req, res) => {
    res.status(200).json({ msg: "Ok" });
});
exports.default = AuthRouter;
