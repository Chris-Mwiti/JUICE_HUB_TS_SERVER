import { NextFunction, Request, Response } from "express";
import jsonwebtoken, { JwtPayload, decode } from "jsonwebtoken";
import { IUser } from "../models/Interfaces/IModels";

function JWTMiddlewareAssigner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessTokenMaxAge = 15 * 60 * 1000;
  const refreshTokenMaxAge = 24 * 60 * 60 * 1000;

  console.log("Hello..");
  //Checks if a refreshToken or accessToken already exists
  const authHeader = req.headers["authorization"];
  let headerAccessToken: string | undefined,
    headerRefreshToken: string | undefined;

  console.log(authHeader);
  if (authHeader) {
    const [bearer, accessToken, refreshToken] = authHeader.split(" ");
    console.log(accessToken,refreshToken);
    headerAccessToken = accessToken;
    headerRefreshToken = refreshToken;
  }

  if (!req.user) return res.status(404).json({ err: "User does not exist" });

  const user = req.user as IUser;
  const accessToken = jsonwebtoken.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: accessTokenMaxAge }
  );

  const refreshToken = jsonwebtoken.sign(
    { userId: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: refreshTokenMaxAge }
  );

  //Reassign a new accessToken if one has already expired by use of the refreshToken assigned
  if (!headerAccessToken && headerRefreshToken) {
    console.log("1.");
    const decryptedRefreshToken = jsonwebtoken.verify(
      headerRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    if (typeof decryptedRefreshToken === "string")
      return res.status(401).json({ err: "Unauthorized" });
    if ("userId" in decryptedRefreshToken && "role" in decryptedRefreshToken) {
      res.status(200).json({
        accessToken,
        refreshToken,
      });
      return next();
    }
  } else if (!headerRefreshToken && headerAccessToken) {
    console.log("2.");
    //Client browser already has an accessToken
    return next();
  } else {
    console.log("Adding cookies..");
    res.status(200).json({
      accessToken,
      refreshToken,
    });
    next();
  }
}

export default JWTMiddlewareAssigner;
