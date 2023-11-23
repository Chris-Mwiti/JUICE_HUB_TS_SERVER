import { Prisma } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import prismaErrHandler, { PrismaErrorTypes } from "../helpers/prismaErrHandler";
import trycatchHelper from "../util/functions/trycatch";
import { IDiscount } from "./Interfaces/IModels";
import RecordIdGenerator from "./generators/RecordIdGenerator";

export type TDiscountRecord = Omit<IDiscount, "id" | "createdAt" | "updatedAt">;

const joinedDiscount = Prisma.validator<Prisma.DiscountDefaultArgs>()({
    include:{
        product:{
            select:{
                id: true,
                discountIds: true,
            }
        }
    }
})

export type TJoinedDiscount = Prisma.DiscountGetPayload<typeof joinedDiscount>;

const discountInclude: Prisma.DiscountInclude = Prisma.validator<Prisma.DiscountInclude>()({
    product:{
        select:{
            id:true,
            discountIds: true
        }
    }
}) 


class DiscountModel {
    private static model = prismaClient.discount;


    public static async createDiscount(info:TDiscountRecord){
        const { data:newInfo, error:postErr } = await trycatchHelper<IDiscount>(
            () => this.model.create({
                data:{
                    id: new RecordIdGenerator("DISCOUNT").generate(),
                    ...info
                }
            })
        )
        if(postErr) prismaErrHandler(postErr as PrismaErrorTypes)

        return newInfo
    }

    public static async getAllDiscountCoupons(joinProperties?:boolean){
        const { data:discountInfos, error:fetchErr } = await trycatchHelper<IDiscount[] | TJoinedDiscount[]>(
            () => this.model.findMany({ 
                include: joinProperties ? discountInclude : undefined
            })
        )
        if(fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);

        return discountInfos
    }

    public static async getDiscountById(discountId:string, joinProperties?:boolean){
        const { data:discountInfo, error:fetchErr } = await trycatchHelper<IDiscount | TJoinedDiscount>(
            () => this.model.findUnique({
                where:{
                    id:discountId
                },
                include: joinProperties ? discountInclude : undefined
            })
        )
        if(fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);
        return discountInfo
    }

    public static async updateDiscountById(discountId:string, info: Partial<TDiscountRecord>, joinProperties?:boolean){
        const { data:updatedInfo, error: updateErr } = await trycatchHelper<IDiscount | TJoinedDiscount>(
            () => this.model.update({
                where:{
                    id: discountId
                },
                data:info,
                include: joinProperties ? discountInclude : undefined
            })
        )

        if(updateErr) prismaErrHandler(updateErr as PrismaErrorTypes);
        return updatedInfo
    }

    public static async deleteDiscountById(discountId:string){
        const { data:deletedInfo, error: deleteErr } = await trycatchHelper<IDiscount>(
            () => this.model.delete({
                where:{
                    id: discountId
                }
            })
        )
        if(deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

        return deletedInfo
    }

    public static async deleteAllDiscounts(){
        const { data: deletedInfos, error: deleteErr } = await trycatchHelper<IDiscount[]>(
            () => this.model.deleteMany()
        )
        if(deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

        return deletedInfos
    }
}

export default DiscountModel