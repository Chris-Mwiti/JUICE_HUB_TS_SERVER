"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../helpers/logger"));
const customError_1 = __importDefault(require("../helpers/customError"));
// Custom Error handler
class ErrMiddleWareHandler {
    static ErrHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        logger_1.default.ErrorLogger(err, 'errLogs.txt');
        if (err instanceof customError_1.default) {
            res.status(Number(err.code)).json({ err: err.message });
        }
        else {
            res.status(500).json({ err: "Server side error" });
        }
        console.error(err.stack);
    }
}
exports.default = ErrMiddleWareHandler;
