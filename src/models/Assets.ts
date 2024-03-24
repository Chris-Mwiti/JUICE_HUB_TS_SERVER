import { ProductAsset } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";

class AssetsModel {
  private static model = prismaClient.productAsset;

  public static async getAllAssets() {
    const {data: assetInfos, error:fetchErr } = await trycatchHelper<ProductAsset>(
      () => this.model.findMany()
    );
    if(fetchErr) throw new DatabaseError({
      message: ["Error while fetching assets info", fetchErr as PrismaErrorTypes],
      code: "500"
    })
    return assetInfos 
  }
}