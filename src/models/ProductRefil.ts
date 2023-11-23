import { ProductRefil as IProductRefill, Product as IProduct, Inventory as IInventory, Prisma, RefillStatus } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";


const productRefillInventory = Prisma.validator<Prisma.ProductRefilDefaultArgs>()({
    include: {
        product:{
            select:{
                buyingPrice: true,
                productName: true,
                supplierId: true,
                inventory:{
                    select:{
                        lastRefilDate: true,
                        quantity: true
                    }
                }
            }
        }
    }
})
type TProductRefillInventory = Prisma.ProductRefilGetPayload<typeof productRefillInventory>

const productRefillInclude:Prisma.ProductRefilInclude = Prisma.validator<Prisma.ProductRefilInclude>()({
    product:{
        select:{
            buyingPrice: true,
            productName: true,
            supplierId: true,
            inventory:{
                select:{
                    lastRefilDate: true,
                    quantity: true
                }
            }
        }
    }
})

interface IProductRefillClass {
    createProductRefill(productId:string,refillAmount:number):IProductRefill;
    getProductRefillsByProductIdAndDate(productId:string,startDate:Date,endDate:Date,joinProperties?:boolean):IProductRefill[] | TProductRefillInventory[];
    getAllProductRefillsByDate(startDate:Date,endDate:Date,joinProperties?:boolean):IProductRefill[] | TProductRefillInventory[];
    getProductRefillById(refillId:string,joinProperties?:boolean):IProductRefill | TProductRefillInventory;
    getProductRefillByProductById(productId:string,joinProperties?:boolean):IProductRefill[] | TProductRefillInventory[];
    updateProductRefillStatusById(refillId:string,joinProperties?:boolean):IProductRefill | TProductRefillInventory;
    deleteProductRefillById(refillId:string):IProductRefill
}

class ProductRefillsModel {
  private static model = prismaClient.productRefil;

  public static async createProductRefill(
    productId: string,
    refillAmount: number
  ) {
    const { data: newProductRefil, error: postError } =
      await trycatchHelper<IProductRefill>(() =>
        this.model.create({
          data: {
            id: new RecordIdGenerator("REFILL").generate(),
            refilAmount: refillAmount,
            productId: productId,
          },
        })
      );

    if (postError) prismaErrHandler(postError as PrismaErrorTypes);

    return newProductRefil;
  }

  public static async getAllProductRefillsByDate(startDate: Date, endDate: Date, joinProperties?:boolean) {
    const { data: productsRefills, error: fetchError } = await trycatchHelper<
      IProductRefill[] | TProductRefillInventory[]
    >(
        () => this.model.findMany({
            where:{
                refilDate:{
                    gte: endDate,
                    lte: startDate
                }
            },
            include: joinProperties ? productRefillInclude : undefined
        })
    )

    if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productsRefills
  }

  public static async getProductRefillsByProductIdAndDate(productId:string, startDate:Date, endDate:Date, joinProperties?:boolean){
    const { data:productRefills, error: fetchError } = await trycatchHelper
    <
        IProductRefill | TProductRefillInventory
    >
    (
        () => this.model.findMany({
            where:{
                productId:productId,
                refilDate:{
                    gte: endDate,
                    lte: startDate
                }
            },
            include: joinProperties ? productRefillInclude : undefined
        })
    )

    if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productRefills
  }

  public static async getProductRefillByProductId(productId:string,joinProperties?:boolean){
    const { data:productRefillInfos, error:fetchError } = await trycatchHelper<IProductRefill>(
        () => this.model.findMany({
            where:{
                productId: productId
            },
            include: joinProperties ? productRefillInclude : undefined
        })
    )
    if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productRefillInfos
  }

  public static async getProductRefillById(refillId:string,joinProperties?:boolean){
    const { data:productRefillInfo, error:fetchError } = await trycatchHelper<IProductRefill | TProductRefillInventory>(
        () => this.model.findUnique({
            where:{
                id:refillId
            },
            include: joinProperties ? productRefillInclude : undefined
        })
    )

    if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productRefillInfo
  }

  public static async updateProductRefillStatusById(refillId:string, status:RefillStatus, joinProperties?:boolean){
    const { data: updatedRefillStatus, error: updateError } = await trycatchHelper<IProductRefill>(
        () => this.model.update({
            where:{
                id: refillId
            },
            data:{
                status: status
            },
            include: joinProperties ? productRefillInclude : undefined
        })
    )

    if(updateError) prismaErrHandler(updateError as PrismaErrorTypes)

    return updatedRefillStatus
  }

  public static async deleteProductRefillById(refillId: string){
    const { data: deletedRefillInfo, error: deleteError } = await trycatchHelper<IProductRefill>(
        () => this.model.delete({
            where:{
                id: refillId
            }
        })
    )

    if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes)

    return deletedRefillInfo
  }
}

export default ProductRefillsModel
