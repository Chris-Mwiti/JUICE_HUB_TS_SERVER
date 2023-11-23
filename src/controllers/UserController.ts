import { Request, Response } from "express";
import UserModel from "../models/User";
import RecordIdGenerator from "../models/generators/RecordIdGenerator";
import trycatchHelper from "../util/functions/trycatch";
import { IUser, UserRecordWithoutId } from "../models/Interfaces/IModels";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import CustomError, { checkErrProperties } from "../helpers/customError";

class UserController {
  //Initialize the user model & record id generator
  private model = UserModel;

  constructor(private req: Request, private res: Response) {
    this.req = req;
    this.res = res;
  }

  public async getUser() {
    const { id } = this.req.params;
    const { data: currentUser, error: fetchErr } = await trycatchHelper<IUser>(
      () => this.model.getUser(id)
    );
    if (fetchErr)
      this.res.status(500).json({ err: `Error while fetching user: ${id}` });
    new ResponseHandler<IUser | null>(this.res, currentUser).getResponse();
  }

  //Used for updating users info
  public async updateUser() {
    const { id } = this.req.params;
    const userInfo: Partial<UserRecordWithoutId> = this.req.body;
    const { data: updatedUser, error: updateErr } = await trycatchHelper<IUser>(
      () => this.model.updateUser(userInfo, id)
    );
    if (updateErr)
      this.res.status(500).json({ err: `Error while updating user: ${id}` });
    new ResponseHandler<IUser | null>(this.res, updatedUser).updateResponse();
  }

  public async deleteUser() {
    const { id } = this.req.params;
    const { data: deletedUser, error: deleteError } =
      await trycatchHelper<IUser>(() => this.model.deleteUser(id));
    if (deleteError)
      this.res.status(500).json({ err: `Error while deleting user: ${id}` });
    new ResponseHandler<IUser | null>(this.res, deletedUser).deleteResponse();
  }
}

export default UserController;
