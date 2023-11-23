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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const date_fns_1 = require("date-fns");
class LoggerHelper {
    static Logger(message, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            // Constructs date format of when the request was made and the file item structure
            const dateTime = (0, date_fns_1.format)(new Date(), "yyMMdd\tHH:mm:ss");
            const fileItem = `${dateTime}\t${(0, crypto_1.randomUUID)()}\t${message}`;
            try {
                yield fs_1.promises.appendFile(path_1.default.join(__dirname, "..", "logs", filename), fileItem);
            }
            catch (UnknownError) {
                console.error(UnknownError);
            }
        });
    }
    static RequestLogger(req, res, next) {
        // @TODO: Research more on express requests and response objects
        LoggerHelper.Logger(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requests.txt');
        next();
    }
    static ErrorLogger(error, filename) {
        LoggerHelper.Logger(`${error.name}\t${error.message}\n`, filename);
    }
}
exports.default = LoggerHelper;
