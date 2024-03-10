import { Images, ProductAsset } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";
import { UploadApiResponse } from "cloudinary";

class AssetsModel {
  private static model = prismaClient.productAsset;
  private static imageModel = prismaClient.images;

  public static async createAsset(images: UploadApiResponse[]) {
    const creationPromises = images.map(async (image) => {
      const { data: assetInfo, error: creationError } =
        await trycatchHelper<ProductAsset>(() =>
          this.model.create({
            data: {
              id: new RecordIdGenerator("ASSET").generate(),
              images: {
                create: {
                  id: new RecordIdGenerator("IMAGE").generate(),
                  imageUrl: image.public_id,
                },
              },
            },
          })
        );

      if (creationError)
        throw new DatabaseError({
          message: [
            "Asset Creation failure",
            creationError as PrismaErrorTypes,
          ],
          code: "500",
        });

      return assetInfo;
    });

    const creationResponse = await Promise.all(creationPromises);

    return creationResponse;
  }

  public static async getAllAssetInfo() {
    const { data: assetInfos, error: fetchError } = await trycatchHelper<
      ProductAsset[]
    >(() => this.model.findMany());

    if (fetchError)
      throw new DatabaseError({
        message: ["Assets fetch error", fetchError as PrismaErrorTypes],
        code: "500",
      });

    return assetInfos;
  }

  public static async gettAssetInfo(assetId: string) {
    const { data: assetInfo, error: fetchError } =
      await trycatchHelper<ProductAsset>(() =>
        this.model.findMany({
          where: {
            id: assetId
          },
        })
      );

    if (fetchError)
      throw new DatabaseError({
        message: ["Asset fetch error", fetchError as PrismaErrorTypes],
        code: "500",
      });

    return assetInfo;
  }

  //@TODO: Refactor the to only update the images using only the imageId
  public static async updateAssetInfo(assetIds: string[], imagesInfo: string[]) {
    const updatePromiseResponse = assetIds.map(async (assetId,index) => {
      const {data: updatedInfo, error:updateError} = await trycatchHelper<Images>(
        () => this.imageModel.update({
          where:{
            assetId: assetId
          },
          data: {
            imageUrl: imagesInfo[index]
          }
        })
      )

      if(updateError) throw new DatabaseError({
        message: ["Asset update error", updateError as PrismaErrorTypes],
        code: "500"
      })

      return updatedInfo
    });

    const updateResponse = await Promise.all(updatePromiseResponse);
    return updateResponse
  }

  public static async deleteAllAssetsByAssetId(assetId:string){
    const {data: deleteInfos, error: deleteError} = await trycatchHelper<ProductAsset>(
        () =>  this.model.deleteMany({
            where:{
                id: assetId
            }
        })
    )

    if(deleteError) throw new DatabaseError({
        message: ["Asset Deletion error", deleteError as PrismaErrorTypes],
        code: "500"
    })

    return deleteInfos
  }
}

export default AssetsModel
