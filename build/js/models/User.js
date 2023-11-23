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
const prismaConfig_1 = __importDefault(require("../config/prismaConfig"));
const prismaErrHandler_1 = __importDefault(require("../helpers/prismaErrHandler"));
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
class UserModel {
    // CRUD OPERATIONS FOR THE USER MODEL:
    static createUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: userRecord, error: postErr } = yield (0, trycatch_1.default)(() => this.model.create({
                data: userInfo,
            }));
            if (postErr)
                (0, prismaErrHandler_1.default)(postErr);
            return userRecord;
        });
    }
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: usersRecords, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findMany());
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return usersRecords;
        });
    }
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: userRecord, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: id,
                },
            }));
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return userRecord;
        });
    }
    static updateUser(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedInfo, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: id,
                },
                data: userInfo,
            }));
            if (updateErr)
                (0, prismaErrHandler_1.default)(updateErr);
            return updatedInfo;
        });
    }
    static updateManyUsers(usersObj) {
        return __awaiter(this, void 0, void 0, function* () {
            //Maps through every enlisted user that requires an update.
            const updatedUserInfosPromises = usersObj.map((user) => __awaiter(this, void 0, void 0, function* () {
                const { data: updatedInfo, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.update({
                    where: {
                        id: user.id,
                    },
                    data: user.updateInfo,
                }));
                if (updateErr) {
                    (0, prismaErrHandler_1.default)(updateErr);
                }
                if (!updatedInfo)
                    return;
                return updatedInfo;
            }));
            const updatedUserInfos = yield Promise.all(updatedUserInfosPromises);
            return updatedUserInfos;
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfo, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.delete({
                where: {
                    id: id,
                },
            }));
            if (deleteErr)
                (0, prismaErrHandler_1.default)(deleteErr);
            return deletedInfo;
        });
    }
    static deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfos, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.deleteMany());
            if (deleteErr)
                (0, prismaErrHandler_1.default)(deleteErr);
            return deletedInfos;
        });
    }
}
//Instantiates the user model
UserModel.model = prismaConfig_1.default.user;
exports.default = UserModel;
