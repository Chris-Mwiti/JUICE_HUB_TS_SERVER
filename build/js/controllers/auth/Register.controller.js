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
const AuthController_1 = __importDefault(require("./AuthController"));
const trycatch_1 = __importDefault(require("../../util/functions/trycatch"));
const customError_1 = require("../../helpers/customError");
const modelResponseHandlers_1 = __importDefault(require("../../util/classes/modelResponseHandlers"));
class RegisterController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.req = req;
        this.res = res;
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = this.req.body;
            const authController = new AuthController_1.default("local");
            const isUserExisting = yield authController.CheckIfUserExists(userInfo.email);
            if (isUserExisting)
                return this.res.status(400).json({ err: "user already exists" });
            const { data: newUser, error: postErr } = yield (0, trycatch_1.default)(() => authController.CreateUser(userInfo));
            if (postErr)
                return (0, customError_1.checkErrProperties)(this.res, postErr);
            new modelResponseHandlers_1.default(this.res, newUser).postResponse();
        });
    }
}
exports.default = RegisterController;
