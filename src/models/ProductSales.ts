import {
  ProductSales as IProductSales,
  Product as IProduct,
  Prisma,
} from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";
import RecordIdGenerator from "./generators/RecordIdGenerator";

interface IProductSaleClass {
  createProductSale:(sale:number,productId:string,lastPurchaseDate?:Date) => IProductSales;
  getAllProductSales:(joinProperties?:boolean) => IProductSales[] | TProductSaleProduct[];
  getProductSalesByDate:(startDate:Date, endDate:Date,joinProperties?:boolean) => IProductSales[] | TProductSaleProduct[];
  getProducySaleById:(saleId:string,joinProperties?:boolean) => IProductSales | TProductSaleProduct;
  updateProductSaleById:(updateInfo:IUpdateSaleInfo,joinProperties?:boolean) => IProductSales | TProductSaleProduct
  deleteProductSaleById:(saleId:string) => IProductSales;
  deleteAllProductSalesByDate:(startDate:Date,endDate:Date) => IProductSales[];
}


type TUpdateInfo = {
    sale?:number;
    lastPurchaseDate?:Date;
}
interface IUpdateSaleInfo {
    saleId: string;
    info:TUpdateInfo
}

const productSaleProduct = Prisma.validator<Prisma.ProductSalesDefaultArgs>()({
    include:{
        product:{
            select:{
                sellingPrice: true,
                productName: true
            }
        }
    }
})
const productSaleIncludeProduct: Prisma.ProductSalesInclude = Prisma.validator<Prisma.ProductSalesInclude>()({
    product:{
        select:{
            sellingPrice: true,
            productName: true
        }
    }
})
type TProductSaleProduct = Prisma.ProductSalesGetPayload<typeof productSaleProduct>;


class ProductSalesModel {
  private static model = prismaClient.productSales;

  public static async createProductSale(sales:number, productId:string, lastPurchaseDate?:Date){
    const {data: newProductSale, error:postError} = await trycatchHelper<IProductSales>(
        () => this.model.create({
            data:{
                id: new RecordIdGenerator("SALE").generate(),
                lastPurchaseDate: lastPurchaseDate ? lastPurchaseDate : new Date(),
                sales: sales,
                productId: productId
            }
        })

        )
    if(postError) prismaErrHandler(postError as PrismaErrorTypes);

    return newProductSale
  }

  public static async getAllProductSales(
    joinProperties?:boolean
  ) {
    const { data: productSales, error: fetchError } = await trycatchHelper<
      IProductSales[] | TProductSaleProduct[]
    >(() =>
      this.model.findMany({
        include: joinProperties ? productSaleIncludeProduct : undefined
      })
    );

    if (fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productSales;
  }

  public static async getProductSalesByDate(
    startDate: Date,
    endDate: Date,
    joinProperties?:boolean
  ) {
    const { data: productSale, error: fetchError } =
      await trycatchHelper<IProductSales[] | TProductSaleProduct[]>(
        () => this.model.findMany({
            where:{
                lastPurchaseDate:{
                    gte: endDate,
                    lte: startDate
                }
            },
            include: joinProperties ? productSaleIncludeProduct : undefined
        })
      )

    if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return productSale
  }

  public static async getProductSaleById(saleId:string,joinProperties?:boolean){
    const { data:saleInfo, error:fetchError } = await trycatchHelper<IProductSales>(
      () => this.model.findUnique({
        where:{
          id:saleId
        },
        include: joinProperties ? productSaleIncludeProduct : undefined
      })
    )

    if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

    return saleInfo
  }


  public static async updateProductSaleById(updateInfo:IUpdateSaleInfo, joinProperties?:boolean){
    const { data:updatedSaleInfo,error:updateError } = await trycatchHelper<IProductSales>(
      () => this.model.update({
        where:{
          id:updateInfo.saleId
        },
        data:updateInfo.info,
        include: joinProperties ? productSaleIncludeProduct : undefined
      })
    )
    if(updateError) prismaErrHandler(updateError as PrismaErrorTypes);

    return updatedSaleInfo
  }

  public static async deleteProductSaleById(saleId:string){
    const { data: deletedSaleInfo, error: deleteError } = await trycatchHelper<IProductSales>(
        () => this.model.delete({
            where:{
                id: saleId,
            }
        })
    )

    if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes);
     
    return deletedSaleInfo

  }

  public static async deleteAllProductSalesByDate(startDate: Date, endDate: Date){
    const {data: deletedSalesInfos, error: deleteError} = await trycatchHelper<IProductSales[]>(
        () => this.model.deleteMany({
            where:{
                lastPurchaseDate:{
                    gte: endDate,
                    lte: startDate
                }
            }
        })
    )

    if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes);

    return deletedSalesInfos;

  }

}

export { IProductSaleClass }
export default ProductSalesModel;