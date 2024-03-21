import { Request, Response } from "express";
import { IUser, IUserSignUpCredentials, UserRecordWithoutId } from "../../models/Interfaces/IModels";
import AuthController from "./AuthController";
import trycatchHelper from "../../util/functions/trycatch";
import { checkErrProperties } from "../../helpers/customError";
import ResponseHandler from "../../util/classes/modelResponseHandlers";

class RegisterController {
  constructor(private req: Request, private res: Response) {
    this.req = req;
    this.res = res;
  }

  public async createUser() {
    const userInfo: UserRecordWithoutId = this.req.body;

    const authController = new AuthController("local");

    const {data: isUserExisting, error:checkErr } = await trycatchHelper<boolean>(
      () => authController.CheckIfUserExists(userInfo.email)
    )

    if(checkErr) return checkErrProperties(this.res,checkErr);

    if (isUserExisting)
      return this.res.status(400).json({ err: "user already exists" });

    const { data: newUser, error: postErr } = await trycatchHelper<IUser>(() =>
      authController.CreateUser(userInfo)
    );
    if (postErr) return checkErrProperties(this.res, postErr);

    new ResponseHandler<IUser | null>(this.res, newUser).postResponse();
  }
}

export default RegisterController;
