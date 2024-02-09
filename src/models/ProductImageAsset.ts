import { Images as IProductImage, Prisma } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";
import CustomError from "../helpers/customError";
import DatabaseError from "../helpers/databaseError";

const imageAssetInclude: Prisma.ImagesInclude =
  Prisma.validator<Prisma.ImagesInclude>()({
    asset: {
      select: {
        id: true,
      },
    },
  });

const imageAssetProduct = Prisma.validator<Prisma.ImagesDefaultArgs>()({
  include: {
    asset: {
      select: {
        id: true,
      },
    },
  },
});

type TJoinImageAsset = Prisma.ImagesGetPayload<typeof imageAssetProduct>;

interface IUpdateInfo {
  id: string;
  imageUrl: string;
}

class ProductImgeAssetModel {
  private static model = prismaClient.images;

  public static async addImageAsset(imageAsset: IProductImage) {
    const { data: imageInfo, error: postErr } =
      await trycatchHelper<TJoinImageAsset>(() =>
        this.model.create({
          data: {
            id: imageAsset.id,
            imageUrl: imageAsset.imageUrl,
            assetId: imageAsset.assetId,
          },

          include: imageAssetInclude,
        })
      );

    if (postErr) prismaErrHandler(postErr as PrismaErrorTypes);
  }

  public static async getImageAssetById(id: string) {
    const { data: imageInfo, error: fetchErr } =
      await trycatchHelper<IProductImage>(() =>
        this.model.findUnique({
          where: {
            id: id,
          },

          include: imageAssetInclude,
        })
      );

    if (fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);

    return imageInfo;
  }

  public static async getImageAssets() {
    const { data: imageInfos, error: fetchErr } = await trycatchHelper<
      TJoinImageAsset[]
    >(() =>
      this.model.findMany({
        include: imageAssetInclude,
      })
    );

    if (fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);
    return imageInfos;
  }

  public static async updateImageAsset(imageInfo: IUpdateInfo) {
    const { data: updatedInfo, error: updateErr } =
      await trycatchHelper<TJoinImageAsset>(() =>
        this.model.update({
          where: {
            id: imageInfo.id,
          },

          data: {
            imageUrl: imageInfo.imageUrl,
          },

          include: imageAssetInclude,
        })
      );

    if (updateErr) prismaErrHandler(updateErr as PrismaErrorTypes);

    return updatedInfo;
  }

  public static async updateManyImageAsset(imageInfos: IUpdateInfo[]) {
    const updatedImageAssetInfoPromises = imageInfos.map(async info => {
        const {data: updatedInfo, error: updateErr} = await trycatchHelper<TJoinImageAsset>(
            () => this.model.update({
                where:{
                    id:info.id
                },
                data:{
                    imageUrl: info.imageUrl
                },
                include: imageAssetInclude
            })
        )

        if(updateErr) return new DatabaseError({
            message: [`Error while updating image asset: ${info.id}`, updateErr as PrismaErrorTypes],
            code: "500"
        })

        if(!updatedInfo) return new DatabaseError({
          message: [`Error while updating imageAsset: ${info.id}`, {} as PrismaErrorTypes],
          code: "500",
        });

        return updatedInfo
    })

    return Promise.all(updatedImageAssetInfoPromises);
  }
}
