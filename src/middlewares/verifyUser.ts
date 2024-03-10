import { NextFunction, Request, Response } from "express";
import { IUser, IUserLoginCredentials } from "../models/Interfaces/IModels";
import trycatchHelper from "../util/functions/trycatch";
import AuthController from "../controllers/auth/AuthController";
import { checkErrProperties } from "../helpers/customError";

/**
 * Verifies users using the local strategy method(email & password)
 *
 */

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  const userInfo: IUserLoginCredentials = req.body;

  const authController = new AuthController("local");
  const { data: user, error: checkErr } = await trycatchHelper<IUser>(() =>
    authController.CheckIfUserExists(userInfo.email)
  );
  if (checkErr) return checkErrProperties(res,checkErr);

  if (!user)
    return res
      .status(404)
      .json({ err: "Incorrect email or User does not exist" });

  //Checks if the user logged in via a provider such as google or facebook...
  if (!user.password)
    return res.status(400).json({ err: "Please log in back via a provider" });

  const isPasswordCorrect = await authController.DecryptPassword(
    user.password,
    userInfo.password
  );
  if (!isPasswordCorrect)
    return res.status(401).json({ err: "Wrong password" });

  //Attaches the user to the request object
  req.user = user;

  next();
}

export default verifyUser;
