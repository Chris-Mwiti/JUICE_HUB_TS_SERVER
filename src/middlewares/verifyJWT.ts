import { NextFunction, Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken'

interface IReqCookies {
    accessToken: string;
    refreshToken: string;
}

function verifyJWT(req: Request, res: Response, next: NextFunction){
    const cookies: IReqCookies = req.cookies;
    if(!cookies || !cookies.accessToken || !cookies.refreshToken) return res.status(401).json({err: "No cookies was found"});

    const decryptedToken = jsonwebtoken.verify(
        cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
    );

    if(typeof decryptedToken === "string") return res.status(500).json({err: "Error while decrypting token"})

    if("userId" in decryptedToken && "role" in decryptedToken){
        req.user = {
            "userId": decryptedToken.userId,
            "role": decryptedToken.role
        }
        return next()
    }else{
        return res.status(401)
    }
}

export default verifyJWT