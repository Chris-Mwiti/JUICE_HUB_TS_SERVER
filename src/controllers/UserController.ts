import { Request, Response } from "express";
import UserModel from "../models/User";
import RecordIdGenerator from "../models/generators/RecordIdGenerator";
import trycatchHelper from "../util/functions/trycatch";
import { IUser, UserRecordWithoutId } from "../models/Interfaces/IModels";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import CustomError, { checkErrProperties } from "../helpers/customError";
import { User } from "@prisma/client";
import AuthController from "./auth/AuthController";
import logger from "../util/functions/logger";

class UserController {
  //Initialize the user model & record id generator
  private model = UserModel;

  constructor(private req: Request, private res: Response) {
    this.req = req;
    this.res = res;
  }

  public async getUser() {
    logger("users").info("Fetching user");    
    const { userId } = this.req.params;
    const { data: currentUser, error: fetchErr } = await trycatchHelper<IUser>(
      () => this.model.getUser(userId)
    );
    if (fetchErr)
      this.res.status(500).json({ err: `Error while fetching user: ${userId}` });
    new ResponseHandler<IUser | null>(this.res, currentUser).getResponse();
  }

  public async getAllUsers() {
    logger("users").info("Fetching users")
    const { data:usersInfo, error:fetchErr } = await trycatchHelper<User[]>(
      () => this.model.getUsers()
    );

    if(fetchErr) return checkErrProperties(this.res,fetchErr);

    new ResponseHandler<User[] | null>(this.res,usersInfo).getResponse();
  }

  //Used for updating users info
  public async updateUser() {
    logger("users").info("Updating user")
    const { userId } = this.req.params;
    const userInfo: Partial<User> = this.req.body;

    //Check if its a password change
    if("password" in userInfo){
      userInfo.password = await new AuthController("local").HashPassword(userInfo.password!);
    }

    delete userInfo.id
    
    const { data: updatedUser, error: updateErr } = await trycatchHelper<IUser>(
      () => this.model.updateUser(userInfo, userId)
    );
    if (updateErr)
      this.res.status(500).json({ err: `Error while updating user: ${userId}` });
    new ResponseHandler<IUser | null>(this.res, updatedUser).updateResponse();
  }

  public async deleteUser() {
    logger("users").info("Deleting user");
    const { userId } = this.req.params;
    const { data: deletedUser, error: deleteError } =
      await trycatchHelper<IUser>(() => this.model.deleteUser(userId));
    if (deleteError)
      this.res.status(500).json({ err: `Error while deleting user: ${userId}` });
    new ResponseHandler<IUser | null>(this.res, deletedUser).deleteResponse();
  }

  public async deleteAllUsers() {
    logger("users").info("Deliting users");
    const { data:deletedUsers, error:deleteErr } = await trycatchHelper<User[]>(
      () => this.model.deleteAllUsers()
    )

    if(deleteErr) return checkErrProperties(this.res,deleteErr);

    new ResponseHandler<User[] | null>(this.res, deletedUsers).deleteResponse();
  }
}

export default UserController;
