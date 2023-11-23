"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
// Record Id Generator 
class RecordIdGenerator {
    constructor(prefix, noOfBytes = 5) {
        this.noOfBytes = 5;
        this.prefix = prefix;
        this.noOfBytes = noOfBytes;
    }
    generate() {
        const randomId = crypto_1.default.randomBytes(this.noOfBytes).toString('hex');
        const id = `${this.prefix}-${randomId}`;
        return id;
    }
}
exports.default = RecordIdGenerator;
