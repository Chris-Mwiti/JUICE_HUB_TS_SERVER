import { Request, Response } from "express";
import trycatchHelper from "../util/functions/trycatch";
import InventoryModel from "../models/Inventory";
import { IInventory, IProduct, TJoinModel } from "../models/Interfaces/IModels";
import ProductModel from "../models/Products";
import logger from "../util/functions/logger";
import ProductRefillsModel from "../models/ProductRefil";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import { Inventory, Product } from "@prisma/client";
import { checkErrProperties } from "../helpers/customError";

// @TODO: Fetch the products from the cached database

class StockController {
    private model = InventoryModel;
    private productModel = ProductModel;
    private productRefill = ProductRefillsModel;

    constructor(private req:Request, private res:Response){}

    public async updateProductInventory(){

        if("quantity" in this.req.body && "productId" in this.req.body){
            //@TODO: Refactor the following code
            const { quantity, productId } = this.req.body
            const { data: productInfo, error: fetchErr } = await trycatchHelper<TJoinModel<IProduct, IInventory>>(
                () => this.productModel.getProduct(productId,{inventory: true})
            )
            if(fetchErr){
                logger("fetchError").warn("Error while fetching product info");
                return this.res.status(500).json({err: "Error while fetching product info"});
            }
            
            //Update product quantity
            if(productInfo){
                const { data: updateInfo, error: updateErr } = await trycatchHelper<IInventory>(
                    async () => {
                        await this.productRefill.createProductRefill(productId,quantity);
                        const info = await this.model.refilProductQty(productInfo.inventoryId,quantity);
                        return info
                    }
                )
                if(updateErr){
                    logger("updateError").warn("Error while updating product info");
                    return this.res.status(500).json({err: "Error while updating product info"})
                }

                new ResponseHandler<IInventory | null>(this.res, updateInfo).updateResponse();
            }
        }else{
            this.res.status(400).json({err: "Missing field in the request" })
        }
    }

    public async reduceProductQty(inventoryId:string,quantity:number){
        const { data:updatedInfo, error: updateErr} = await trycatchHelper<Inventory>(
            () => this.model.reduceProductQty(inventoryId,quantity)
        )
        if(updateErr) return checkErrProperties(this.res,updateErr);

        return updatedInfo
    }

    public async reduceProductQtyByProductId(productId:string,qty:number){
        const {data: productInfo, error: fetchErr} = await trycatchHelper<Product>(
            () => this.productModel.getProduct(productId)
        )
        if(fetchErr) return checkErrProperties(this.res, fetchErr);
        if(!productInfo) return this.res.status(400).json({err: "Product was not found"});

        const { data: updatedInfo, error: updateErr } =
          await trycatchHelper<Inventory>(() =>
            this.model.reduceProductQty(productInfo?.inventoryId, qty)
          );
        if (updateErr) return checkErrProperties(this.res, updateErr);

        return updatedInfo;
    }
}

export default StockController
