import { Prisma } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";
import trycatchHelper from "../util/functions/trycatch";
import { InnerJoinActionsProperties } from "../util/types/util.types";
import { INewProductInfoObj, IProduct } from "./Interfaces/IModels";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import DatabaseError from "../helpers/databaseError";

export type ProductRecord = Pick<
  IProduct,
  | "id"
  | "productName"
  | "productDescription"
  | "sellingPrice"
  | "categoryId"
  | "inventoryId"
  | "supplierId"
  | "buyingPrice"
>;
export type ProductRecordWithoutId = Pick<
  ProductRecord,
  "productName" | "productDescription" | "sellingPrice" | "buyingPrice"
>;

// @TODO: Check various examples on mapped object type
//@TODO: Redefine the join properties structure to be strongly typed
// Inner join properties
export interface IJoinProperties {
  assetIds?:boolean | {
    include: {
      images: true
    }
  }
  category?: boolean | InnerJoinActionsProperties;
  inventory?: boolean | InnerJoinActionsProperties;
  discount?: boolean | InnerJoinActionsProperties;
  cartItem?: boolean | InnerJoinActionsProperties;
  orderItem?: boolean | InnerJoinActionsProperties;
}

interface IProductUpdateObj {
  id: string;
  updateInfo: Partial<ProductRecordWithoutId>;
}

interface IProductUpdateQtyObj {
  productId: string;
  inventoryId: string;
  qty: number;
}

//Include Type
const productInclude = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    assetIds: {
      include:{
        images: true
      }
    },
    category: true,
    inventory: true,
    supplier: true,
    discountIds: true,
  },
});
const producIncludeProp: Prisma.ProductInclude =
  Prisma.validator<Prisma.ProductInclude>()({
    assetIds:{
      include: {
        images: true
      }
    },
    category: true,
    inventory: true,
    supplier: true,
    discountIds: true,
  });

type TProductInclude = Prisma.ProductGetPayload<typeof productInclude>;

/**
 * Performs CRUD operations on the Product model
 */

class ProductModel {
  private static model = prismaClient.product;

  public static async createProduct(productInfoObj: INewProductInfoObj) {
    // Creates a new product with its relational subset fields if none of them exists
    const { data: productInfo, error: postErr } =
      await trycatchHelper<IProduct>(() =>
        this.model.create({
          data: {
            //Product Details
            id: new RecordIdGenerator("PRODUCT").generate(),
            productName: productInfoObj.productName,
            productDescription: productInfoObj.productDescription,
            buyingPrice: parseInt(productInfoObj.buyingPrice),
            sellingPrice: parseInt(productInfoObj.sellingPrice),
            isPerishable: productInfoObj.isPerishable,
            productSku: productInfoObj.productSku,
            //Product Properties
            category: {
              connectOrCreate: {
                where: {
                  id: productInfoObj.productCategory,
                },
                create: {
                  id: new RecordIdGenerator("CATEGORY").generate(),
                  categoryName: productInfoObj.categoryName ?? "",
                  categoryDescription: productInfoObj.categoryDescription ?? "",
                },
              },
            },
            inventory: {
              create: {
                id: new RecordIdGenerator("INVENTORY").generate(),
                productName: productInfoObj.productName,
                quantity: parseInt(productInfoObj.productQuantity) ?? 0,
                lastRefilDate: new Date(),
              },
            },
            assetIds: {
              connect: productInfoObj.assetId,
            },
            discountIds: {
              connect: {
                id: productInfoObj.discountId,
              },
            },
          },
        })
      );
    if (postErr) return new DatabaseError({
      message: ["An error has occured while creating the product", postErr as PrismaErrorTypes],
      code: "500"
    }) 

    return productInfo;
  }

  public static async getAllProducts(joinProperties?: TProductInclude) {
    const { data: productInfos, error: fetchError } = await trycatchHelper<
      IProduct[]
    >(() =>
      this.model.findMany({
        include: producIncludeProp,
      })
    );
    if (fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);
    return productInfos;
  }

  public static async getProduct(id: string, properties?: IJoinProperties) {
    const { data: productInfo, error: fetchError } =
      await trycatchHelper<IProduct>(() =>
        this.model.findUnique({
          where: {
            id: id,
          },
          include: producIncludeProp,
        })
      );

    if (fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productInfo;
  }

  public static async getProductQuantity(id: string) {
    const { data: productQty, error: fetchError } =
      await trycatchHelper<number>(() =>
        this.model.findUnique({
          where: {
            id: id,
          },
          include: {
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        })
      );
    if (fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productQty;
  }

  public static async updateProductInfo(
    id: string,
    productInfo: Partial<ProductRecordWithoutId>,
    properties?: IJoinProperties
  ) {
    const { data: updatedProductInfo, error: updateError } =
      await trycatchHelper<IProduct>(() =>
        this.model.update({
          where: {
            id: id,
          },
          data: productInfo,
          include: properties,
        })
      );
    if (updateError) prismaErrHandler(updateError as PrismaErrorTypes);

    return updatedProductInfo;
  }

  public static async updateProductQty(
    productUpdateInfo: IProductUpdateQtyObj
  ) {
    //Updates the selected quantity of the selected product
    const { data: updatedProductQty, error: updateError } =
      await trycatchHelper<IProduct>(() =>
        this.model.update({
          where: {
            id: productUpdateInfo.productId,
          },
          data: {
            inventory: {
              update: {
                where: {
                  id: productUpdateInfo.inventoryId,
                },
                data: {
                  quantity: productUpdateInfo.qty,
                },
              },
            },
          },
          include: {
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        })
      );

    if (updateError) prismaErrHandler(updateError as PrismaErrorTypes);

    return updatedProductQty;
  }

  public static async updateManyProducts(
    products: IProductUpdateObj[],
    properties?: IJoinProperties
  ) {
    const updatedProductsPromises = products.map(async (product) => {
      const { data: updatedInfo, error: updateErr } =
        await trycatchHelper<IProduct>(() =>
          this.model.update({
            where: {
              id: product.id,
            },
            data: product.updateInfo,
            include: properties,
          })
        );
      if (updateErr) prismaErrHandler(updateErr as PrismaErrorTypes);

      return updatedInfo;
    });

    const updatedProducts = await Promise.all(updatedProductsPromises);

    return updatedProducts;
  }

  public static async deleteProduct(id: string) {
    const { data: deletedInfo, error: deleteErr } =
      await trycatchHelper<IProduct>(() =>
        this.model.delete({
          where: {
            id: id,
          },
        })
      );
    if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

    return deletedInfo;
  }

  public static async deleteProducts(productIds: string[]) {
    const deletedProductsPromises = productIds.map(async (productId) => {
      const { data: deletedInfos, error: deleteErr } = await trycatchHelper<
        IProduct[]
      >(() =>
        this.model.delete({
          where: {
            id: productId,
          },
        })
      );
      if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

      return deletedInfos;
    });

    const deletedProducts = await Promise.all(deletedProductsPromises);

    return deletedProducts;
  }

  public static async deleteAllProduct() {
    const { data: deletedInfos, error: deleteErr } = await trycatchHelper<
      IProduct[]
    >(() => this.model.deleteMany());
    if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

    return deletedInfos;
  }
}

export default ProductModel;
