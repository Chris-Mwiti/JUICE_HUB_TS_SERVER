import { Roles } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

interface IReqCookies {
  accessToken: string;
  refreshToken: string;
}

export type TReqUser = {
  userId: string;
  role: Roles;
};

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]?.split(" ");
  console.log(authHeader);
  if (authHeader) {
    const [bearer, accessToken, refreshToken] = authHeader;

    if (!refreshToken || !accessToken)
      return res.status(401).json({ err: "No header properties were found" });

    const decryptedToken = jsonwebtoken.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    if (typeof decryptedToken === "string")
      return res.status(500).json({ err: "Error while decrypting token" });

    if ("userId" in decryptedToken && "role" in decryptedToken) {
      req.user = {
        userId: decryptedToken.userId,
        role: decryptedToken.role,
      };
      return next();
    } else {
      return res.status(401);
    }
  }
}

export default verifyJWT;
