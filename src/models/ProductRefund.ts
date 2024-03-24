import { ProductRefunds as IProductRefunds, Prisma, RefundStatus } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import prismaErrHandler, { PrismaErrorTypes } from "../helpers/prismaErrHandler";
import { ObjectId } from "bson";

interface IRefundInfo {
    orderId:string;
    productId:string;
    refundAmount:number;
    refundQuantity:number;
}
const productRefundInclude:Prisma.ProductRefundsInclude = Prisma.validator<Prisma.ProductRefundsInclude>()({
    product:{
        select:{
            sellingPrice:true,
            productName: true
        }
    }
})
const productRefundJoin = Prisma.validator<Prisma.ProductRefundsDefaultArgs>()({
    include:{
        product:{
            select:{
                sellingPrice:true,
                productName:true
            }
        }
    }
})
type TProductInclude = Prisma.ProductRefundsGetPayload<typeof productRefundJoin>

interface IUpdateProductRefundInfo {
    refundId:string;
    status:RefundStatus;
}

/**
 * @NOTE: startDate by default means now
 */

interface IProductsRefundClass {
    createRefund(refundInfo:IRefundInfo):IProductRefunds;
    getRefundsinfoByDateAndStatus(startDate:Date,endDate:Date,status:RefundStatus,joinProperties?:boolean):IProductRefunds[] | TProductInclude[];
    getRefundsInfoByStatus(status:RefundStatus) : IProductRefunds[] | TProductInclude[];
    getRefundInfoByDate(startDate:Date,endDate:Date,joinProperties?:boolean) : IProductRefunds[] | TProductInclude[];
    getRefundInfoById(refundId:string,joinProperties?:boolean) : IProductRefunds | TProductInclude;
    updateRefundStatusById(refundId:string,status:RefundStatus,joinProperties?:boolean) : IProductRefunds
    updateManyRefundStatusByIds(info:IUpdateProductRefundInfo[], joinProperties?:boolean) : IProductRefunds[] | TProductInclude[];
    deleteAllRefundInfo() : IProductRefunds[];
    deleteRefundInfoById(refundId:string) : IProductRefunds;
    deleteRefundInfosByIds(refundIds:string[]) : IProductRefunds[];
    deleteRefundInfoByStatus(status:RefundStatus) : IProductRefunds[];
}


class ProductRefundsModel {

    private static model = prismaClient.productRefunds;

    public static async createRefund(refundInfo:IRefundInfo){
        const { data:newRefundInfo, error:postErr } = await trycatchHelper<IProductRefunds>(
            () => this.model.create({
                data:{
                    id: new ObjectId().toHexString(),
                    refundQuantity: refundInfo.refundQuantity,
                    refundAmount:refundInfo.refundAmount ,
                    productId:refundInfo.productId ,
                    orderId:refundInfo.orderId 
                }
            })
        )

        if(postErr) prismaErrHandler(postErr as PrismaErrorTypes);
        return newRefundInfo
    }

    public static async getRefundsInfoByDateAndStatus(startDate:Date, endDate:Date, status:RefundStatus, joinProperties?:boolean){
        const { data:refundInfos, error:fetchErr } = await trycatchHelper<IProductRefunds[] | TProductInclude[]>(
            () => this.model.findMany({
                where:{
                    returnDate:{
                        gte:endDate,
                        lte:startDate,
                    },
                    status: status
                },
                include: joinProperties ? productRefundInclude : undefined
            })
        )

        if(fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes)

        return refundInfos
    }

    public static async getRefundInfoByStatus(status:RefundStatus, joinProperties?:boolean){
        const { data:refundInfos, error:fetchErr } = await trycatchHelper<IProductRefunds[] | TProductInclude[]>(
            () => this.model.findMany({
                where:{
                    status: status
                },
                include: joinProperties ? productRefundInclude : undefined
            })
        )
        if(fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);

        return refundInfos
    }

    public static async getRefundInfoByDate(startDate:Date, endDate:Date, joinProperties?:boolean){
        const { data:refundInfos, error:fetchErr } = await trycatchHelper<IProductRefunds[] | TProductInclude[]>(
            () => this.model.findMany({
                where:{
                    returnDate:{
                        gte:endDate,
                        lte:startDate
                    }
                },
                include: joinProperties ? productRefundInclude : undefined
            })
        )
        if(fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes)

        return refundInfos
    }

    public static async getRefundInfoById(refundId:string, joinProperties?:boolean){
        const { data:refundInfo, error:fetchError } = await trycatchHelper<IProductRefunds | TProductInclude>(
            () => this.model.findUnique({
                where:{
                    id: refundId
                },
                include: joinProperties ? productRefundInclude : undefined
            })
        )
        if(fetchError) prismaErrHandler(fetchError as PrismaErrorTypes);

        return refundInfo
    }

    public static async updateRefundStatusById(refundId:string, status:RefundStatus, joinProperties?:boolean){
        const { data:updatedRefundInfo, error:updateError } = await trycatchHelper<IProductRefunds>(
            () => this.model.update({
                where:{
                    id:refundId
                },
                data:{
                    status:status
                },
                include: joinProperties ? productRefundInclude : undefined
            })
        )
        if(updateError) prismaErrHandler(updateError as PrismaErrorTypes);
        
        return updatedRefundInfo
    }

    public static async updateManyRefundStatusByIds(infos:IUpdateProductRefundInfo[], joinProperties?:boolean){
        // The letter P stands for a Promise
        const PUpdatedRefunds = infos.map(async info => {
            const { data:updatedInfo, error:updateError } = await trycatchHelper<IProductRefunds>(
                () => this.model.update({
                    where:{
                        id: info.refundId
                    },
                    data:{
                        status: info.status
                    },
                    include: joinProperties ? productRefundInclude : undefined
                })
            )
            if(updateError) prismaErrHandler(updateError as PrismaErrorTypes)
            return updatedInfo
        })

        const updatedProductInfos = await Promise.all(PUpdatedRefunds)

        return updatedProductInfos
    }

    public static async deleteAllRefundInfo(){
        const { data:deletedInfos, error:deleteError } = await trycatchHelper<IProductRefunds[]>(
            () => this.model.deleteMany()
        )
        if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes);

        return deletedInfos
    }

    public static async deleteRefundInfoById(refundId:string){
        const { data:deletedInfo, error:deleteError } = await trycatchHelper<IProductRefunds>(
            () => this.model.delete({
                where:{
                    id:refundId
                }
            })
        )
        if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes);

        return deletedInfo
    }

    public static async deleteRefundInfosByIds(refundIds:string[]){
        const PDeletedRefundInfo = refundIds.map(async id => {
            const { data:deletedInfo, error:deleteError } = await trycatchHelper<IProductRefunds>(
                () => this.model.delete({
                    where:{
                        id:id
                    }
                })
            )
            if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes);

            return deletedInfo
        })

        const deletedInfos = await Promise.all(PDeletedRefundInfo);

        return deletedInfos
    }

    public static async deleteRefundInfoByStatus(status:RefundStatus){
        const { data:deletedInfos, error:deleteError } = await trycatchHelper<IProductRefunds[]>(
            () => this.model.deleteMany({
                where:{
                    status: status
                }
            })
        )
        if(deleteError) prismaErrHandler(deleteError as PrismaErrorTypes);

        return deletedInfos
    }
}

export { IProductsRefundClass }

export default ProductRefundsModel