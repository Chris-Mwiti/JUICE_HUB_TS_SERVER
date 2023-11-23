"use strict";
/**
 * Creates new users depending on the strategy selected:("Google", "JWT" or "LOCAL");
 * Retrives user info from the database;
 * Authorizes if a user has qualified to access certain resources
 *
 */
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
const User_1 = __importDefault(require("../../models/User"));
const prismaConfig_1 = __importDefault(require("../../config/prismaConfig"));
const trycatch_1 = __importDefault(require("../../util/functions/trycatch"));
const customError_1 = __importDefault(require("../../helpers/customError"));
const RecordIdGenerator_1 = __importDefault(require("../../models/generators/RecordIdGenerator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// @TODO: Create guards that will verify if specific properties in an object exists || null || undefined
class AuthController {
    constructor(strategies) {
        this.strategies = strategies;
        this.UserModel = prismaConfig_1.default.user;
        this.strategies = strategies;
    }
    CheckIfUserExists(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            //Narrows down the userInfo types to a string && IUserPartialId respectively
            let email;
            if (typeof userInfo === "string")
                email = userInfo;
            if (typeof userInfo === "object" && "googleId" in userInfo) {
                // Checks if there is any existing users based on there googleId
                if (this.strategies === "google") {
                    const { data: retrivedUser, error: fetchErr } = yield (0, trycatch_1.default)(() => this.UserModel.findUnique({
                        where: {
                            googleId: userInfo.googleId
                        },
                    }));
                    if (fetchErr)
                        throw new customError_1.default({
                            message: "Error while retrieving user",
                            code: "500",
                        });
                    if (!retrivedUser)
                        return null;
                    return retrivedUser;
                }
            }
            else {
                // Checks if user exists based on their email
                const { data: retrivedUser, error: fetchErr } = yield (0, trycatch_1.default)(() => this.UserModel.findUnique({
                    where: {
                        email: email,
                    },
                }));
                if (fetchErr)
                    throw new customError_1.default({
                        message: "Error while retrieving user",
                        code: "500",
                    });
                if (!retrivedUser)
                    return null;
                return retrivedUser;
            }
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: currentUser, error: fetchErr } = yield (0, trycatch_1.default)(() => this.UserModel.findUnique({
                where: {
                    id: id,
                },
            }));
            if (fetchErr)
                throw new customError_1.default({
                    message: "Error while retrieving user",
                    code: "500",
                });
            if (!currentUser)
                throw new customError_1.default({ message: "User not found", code: "404" });
            return currentUser;
        });
    }
    CreateUser(userInfoObj) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generates a new user id
            const userId = new RecordIdGenerator_1.default("USER").generate();
            //Create a new user obj containing the generated id
            let userInfo = Object.assign(Object.assign({}, userInfoObj), { id: userId });
            if (this.strategies === "local") {
                if (userInfoObj.password) {
                    const hashedPassword = yield this.HashPassword(userInfoObj.password);
                    userInfo = Object.assign(Object.assign({}, userInfoObj), { id: userId, password: hashedPassword });
                }
            }
            const { data: newUser, error: postErr } = yield (0, trycatch_1.default)(() => User_1.default.createUser(userInfo));
            if (postErr)
                throw new customError_1.default({
                    message: "Error while creating user",
                    code: "500",
                });
            return newUser;
        });
    }
    HashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.strategies !== "local")
                throw new customError_1.default({
                    message: "Wrong implementation of strategy",
                    code: "400",
                });
            const hashedPassword = yield bcrypt_1.default.hash(password, 12);
            return hashedPassword;
        });
    }
    DecryptPassword(hashedPassword, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.strategies !== "local")
                throw new customError_1.default({
                    message: "Wrong implementation of strategy",
                    code: "400",
                });
            if (!hashedPassword)
                return false;
            const isPasswordCorrect = yield bcrypt_1.default.compare(password, hashedPassword);
            return isPasswordCorrect;
        });
    }
    GenerateJWTToken(userInfo) {
        const { id, role } = userInfo;
        const accessToken = jsonwebtoken_1.default.sign({ userId: id, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15 * 60 });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: id, role: role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 15 * 60 });
        return { accessToken, refreshToken };
    }
    static DecodeJWTToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
}
exports.default = AuthController;
