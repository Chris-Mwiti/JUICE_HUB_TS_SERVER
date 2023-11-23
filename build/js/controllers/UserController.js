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
const User_1 = __importDefault(require("../models/User"));
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
const modelResponseHandlers_1 = __importDefault(require("../util/classes/modelResponseHandlers"));
class UserController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        //Initialize the user model & record id generator
        this.model = User_1.default;
        this.req = req;
        this.res = res;
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = this.req.params;
            const { data: currentUser, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.getUser(id));
            if (fetchErr)
                this.res.status(500).json({ err: `Error while fetching user: ${id}` });
            new modelResponseHandlers_1.default(this.res, currentUser).getResponse();
        });
    }
    //Used for updating users info
    updateUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = this.req.params;
            const userInfo = this.req.body;
            const { data: updatedUser, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.updateUser(userInfo, id));
            if (updateErr)
                this.res.status(500).json({ err: `Error while updating user: ${id}` });
            new modelResponseHandlers_1.default(this.res, updatedUser).updateResponse();
        });
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = this.req.params;
            const { data: deletedUser, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.deleteUser(id));
            if (deleteError)
                this.res.status(500).json({ err: `Error while deleting user: ${id}` });
            new modelResponseHandlers_1.default(this.res, deletedUser).deleteResponse();
        });
    }
}
exports.default = UserController;
