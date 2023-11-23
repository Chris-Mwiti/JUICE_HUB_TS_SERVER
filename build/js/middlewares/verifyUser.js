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
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
const AuthController_1 = __importDefault(require("../controllers/auth/AuthController"));
/**
 * Verifies users using the local strategy method(email & password)
 *
 */
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = req.body;
        const authController = new AuthController_1.default("local");
        const { data: user, error: checkErr } = yield (0, trycatch_1.default)(() => authController.CheckIfUserExists(userInfo.email));
        if (checkErr)
            return res.status(500).json({ err: checkErr.message });
        if (!user)
            return res
                .status(404)
                .json({ err: "Incorrect email or User does not exist" });
        //Checks if the user logged in via a provider such as google or facebook...
        if (!user.password)
            return res.status(400).json({ err: "Please log in back via a provider" });
        const isPasswordCorrect = yield authController.DecryptPassword(user.password, userInfo.password);
        if (!isPasswordCorrect)
            return res.status(401).json({ err: "Wrong password" });
        //Attaches the user to the request object
        req.user = user;
        next();
    });
}
exports.default = verifyUser;
