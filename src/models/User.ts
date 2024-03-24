import prismaClient from "../config/prismaConfig";
import DatabaseError from "../helpers/databaseError";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";
import trycatchHelper from "../util/functions/trycatch";
import { IUser, UserRecordWithoutId, UserRecord } from "./Interfaces/IModels";

type UserUpdateObj = {
  id: string;
  updateInfo: Partial<UserRecordWithoutId>;
};

class UserModel {
  //Instantiates the user model
  private static model = prismaClient.user;

  // CRUD OPERATIONS FOR THE USER MODEL:
  public static async createUser(userInfo: UserRecord) {
    const { data: userRecord, error: postErr } = await trycatchHelper<IUser>(
      () =>
        this.model.create({
          data: userInfo,
        })
    );
    if (postErr) {
      console.log(postErr);
      throw new DatabaseError({
        message:["Error while creating user", postErr as PrismaErrorTypes],
        code: "500"
      })
    };
    return userRecord;
  }

  public static async getUsers() {
    const { data: usersRecords, error: fetchErr } = await trycatchHelper<
      IUser[]
    >(() => this.model.findMany());
    if (fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);
    return usersRecords;
  }

  public static async getUser(id: string) {
    const { data: userRecord, error: fetchErr } = await trycatchHelper<IUser>(
      () =>
        this.model.findUnique({
          where: {
            id: id,
          },
          include: {
            orderDetails: true
          }
        })
    );
    if (fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);
    return userRecord;
  }

  public static async updateUser(
    userInfo: Partial<UserRecordWithoutId>,
    id: string
  ) {
    const { data: updatedInfo, error: updateErr } = await trycatchHelper<IUser>(
      () =>
        this.model.update({
          where: {
            id: id,
          },
          data: userInfo,
        })
    );

    if (updateErr) prismaErrHandler(updateErr as PrismaErrorTypes);
    return updatedInfo;
  }

  public static async updateManyUsers(usersObj: UserUpdateObj[]) {
    //Maps through every enlisted user that requires an update.
    const updatedUserInfosPromises = usersObj.map(async (user) => {
      const { data: updatedInfo, error: updateErr } =
        await trycatchHelper<IUser>(() =>
          this.model.update({
            where: {
              id: user.id,
            },
            data: user.updateInfo,
          })
        );
      if (updateErr) {
        prismaErrHandler(updateErr as PrismaErrorTypes);
      }
      if (!updatedInfo) return;

      return updatedInfo;
    });

    const updatedUserInfos = await Promise.all(updatedUserInfosPromises);

    return updatedUserInfos;
  }

  public static async deleteUser(id: string) {
    const { data: deletedInfo, error: deleteErr } = await trycatchHelper<IUser>(
      () =>
        this.model.delete({
          where: {
            id: id,
          },
        })
    );

    if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);
    return deletedInfo;
  }

  public static async deleteAllUsers() {
    const { data: deletedInfos, error: deleteErr } = await trycatchHelper<
      IUser[]
    >(() => this.model.deleteMany());
    if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);
    return deletedInfos;
  }
}

export default UserModel;
