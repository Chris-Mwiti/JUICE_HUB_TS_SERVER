"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whiteListedDomains = ['http://localhost:5000', 'http://localhost:3000', 'http://localhost:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteListedDomains.includes(origin) || !origin)
            return callback(null, true);
        callback(new Error("You have no acces for the resources provided by this server"), false);
    },
    optionsSuccessStatus: 200,
    credentials: true
};
exports.default = corsOptions;
