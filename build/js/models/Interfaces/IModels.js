"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const userSessions = client_1.Prisma.validator()({
    include: {
        session: true
    }
});
