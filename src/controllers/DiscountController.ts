import { Request, Response } from "express";
import trycatchHelper from "../util/functions/trycatch";
import { IDiscount } from "../models/Interfaces/IModels";
import DiscountModel, { TDiscountRecord, TJoinedDiscount } from "../models/Discounts";
import { checkErrProperties } from "../helpers/customError";
import ResponseHandler from "../util/classes/modelResponseHandlers";

class DiscountController {
   private model = DiscountModel
   constructor(private req: Request, private res: Response){}

   public async createDiscount(){
        if("coupon" in this.req.body && "tokens" in this.req.body && "expirationDate" in this.req.body){
            let newInfo:TDiscountRecord = this.req.body;

            //Converts the expiration date to a date format
            newInfo = {...newInfo, expirationDate:new Date(newInfo.expirationDate)};

            const { data:newDiscountInfo, error: postErr} = await trycatchHelper<IDiscount>(
                () => this.model.createDiscount(newInfo)
            )
            if(postErr) return checkErrProperties(this.res,postErr);
            
            new ResponseHandler(this.res, newDiscountInfo).postResponse();
        }else return this.res.status(400).json({err: "Missing fields"})
   }

   public async getAllDiscounts(){
     const { data:discounts, error:fetchErr } = await trycatchHelper<TJoinedDiscount[]>(
        () => this.model.getAllDiscountCoupons(true)
     )
     if(fetchErr) return checkErrProperties(this.res,fetchErr);

     new ResponseHandler(this.res, discounts).getResponse();
   }

   public async getDiscountById(){
     const { productId } = this.req.params
     const { data:discount, error:fetchErr } = await trycatchHelper<TJoinedDiscount>(
        () => this.model.getDiscountById(productId)
     )

     if(fetchErr) return checkErrProperties(this.res,fetchErr);

     new ResponseHandler(this.res,discount).getResponse();
   }

   public async updateDiscountById(){
    const { productId } = this.req.params
    const info:Partial<TDiscountRecord> = this.req.body
    const { data:updatedInfo, error:updateErr } = await trycatchHelper<TDiscountRecord>(
        () => this.model.updateDiscountById(productId,info)
    )
    if(updateErr) return checkErrProperties(this.res,updateErr);

    new ResponseHandler(this.res,updatedInfo).updateResponse();
   }

   public async deleteDiscountById(){
    const { productId } = this.req.params;
    const { data:deletedInfo, error:deleteErr } = await trycatchHelper<IDiscount>(
        () => this.model.deleteDiscountById(productId)
    )
    if(deleteErr) return checkErrProperties(this.res, deleteErr);

    new ResponseHandler(this.res,deletedInfo).deleteResponse();
   }


   public async deleteAllDiscounts(){
    const { data: deletedInfos, error: deleteErr } = await trycatchHelper<IDiscount[]>(
        () => this.model.deleteAllDiscounts()
    )
    if(deleteErr) return checkErrProperties(this.res,deleteErr)

    new ResponseHandler(this.res,deletedInfos).deleteResponse();

   }
}

export default DiscountController