import prismaClient from "../config/prismaConfig";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";
import { Prisma } from "@prisma/client";
import trycatchHelper from "../util/functions/trycatch";
import { InnerJoinActionsProperties } from "../util/types/util.types";
import { INewProductInfoObj, IProduct } from "./Interfaces/IModels";
import RecordIdGenerator from "./generators/RecordIdGenerator";

export type ProductRecord = Pick<
  IProduct,
  | "id"
  | "productName"
  | "productDescription"
  | "price"
  | "assetId"
  | "categoryId"
  | "inventoryId"
  | "supplierId"
  | "buyingPrice"
>;
export type ProductRecordWithoutId = Pick<
  ProductRecord,
  "productName" | "productDescription" | "price" | "buyingPrice"
>;

// @TODO: Check various examples on mapped object type



// Inner join properties
export interface IJoinProperties {
  category?: boolean | InnerJoinActionsProperties;
  inventory?: boolean | InnerJoinActionsProperties;
  discount?: boolean | InnerJoinActionsProperties;
  asset?: boolean | InnerJoinActionsProperties;
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
            id: new RecordIdGenerator("PRODUCT").generate(),
            productName: productInfoObj.productName,
            productDescription: productInfoObj.productDescription,
            price: productInfoObj.price,
            buyingPrice: productInfoObj.buyingPrice,
            asset: {
              create: {
                id: new RecordIdGenerator("ASSET").generate(),
                image: productInfoObj.image,
              },
            },
            category: {
              connectOrCreate: {
                where: {
                  categoryName: productInfoObj.category,
                },
                create: {
                  id: new RecordIdGenerator("CATEGORY").generate(),
                  categoryName: productInfoObj.category,
                  categoryDescription: productInfoObj.categoryDescription!,
                },
              },
            },
            inventory: {
              create: {
                id: new RecordIdGenerator("INVENTORY").generate(),
                quantity: productInfoObj.inventoryQty,
                productName: productInfoObj.productName,
                lastRefilDate: new Date()
              },
            },
            supplier: {
              connectOrCreate: {
                where:{
                  id: productInfoObj.supplierId ? productInfoObj.supplierId : ""
                },
                create:{
                  id: new RecordIdGenerator("SUPPLIER").generate(),
                  companyName: productInfoObj.companyName!,
                  address: productInfoObj.address!,
                  phone: productInfoObj.phone!
                }
              }
            },
            discountIds:{
              connect:{
                id: productInfoObj.discountId ? productInfoObj.discountId : ""
              }
            }
          },
        })
      );
    if (postErr) prismaErrHandler(postErr as PrismaErrorTypes);

    return productInfo;
  }

  public static async getAllProducts(joinProperties?: IJoinProperties) {
    const { data: productInfos, error: fetchError } = await trycatchHelper<
      IProduct[]
    >(() =>
      this.model.findMany({
        include: joinProperties,
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
          include: properties,
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
