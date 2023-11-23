"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VerifyRoleMiddleware {
    static verifyAdminRole(req, res, next) {
        if (req.user && "role" in req.user) {
            return req.user.role === "admin" ? next() : res.status(403);
        }
    }
    static verifyUserRole(req, res, next) {
        if (req.user && "role" in req.user) {
            return req.user.role === "user" ? next() : res.status(403);
        }
    }
}
exports.default = VerifyRoleMiddleware;
