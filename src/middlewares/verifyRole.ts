import { NextFunction, Request, Response } from "express";

class VerifyRoleMiddleware {
    public static verifyAdminRole(req: Request, res: Response, next: NextFunction){
        if(req.user && "role" in req.user){
            return req.user.role === "admin" ? next() : res.status(403);
        }
    }

    public static verifyUserRole(req: Request, res: Response, next: NextFunction){
        if(req.user && "role" in req.user){
            return req.user.role === "user" ? next() : res.status(403);
        }
    }
}

export default VerifyRoleMiddleware