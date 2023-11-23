"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
function prismaErrHandler(err) {
    logger_1.default.Logger(`${err === null || err === void 0 ? void 0 : err.message}\t ${err === null || err === void 0 ? void 0 : err.name}`, "databaseErrorLogs.txt");
    console.error(err.message);
}
exports.default = prismaErrHandler;
