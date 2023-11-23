"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErrProperties = void 0;
// Extends the Error object by adding a code property
class CustomError extends Error {
    constructor({ message, code }) {
        super(message);
        this.code = code;
        this.name = "Custom Error";
    }
}
function checkErrProperties(res, err) {
    //Checks if there is an
    if (err instanceof CustomError) {
        res.send(err.code).json({ err: err.message });
    }
    else if (err instanceof Error) {
        res.send(500).json({ err: err.message });
    }
    else {
        res.send(500).json({ err: err });
    }
}
exports.checkErrProperties = checkErrProperties;
exports.default = CustomError;
