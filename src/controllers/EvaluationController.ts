import { ProductSales } from "@prisma/client";
import trycatchHelper from "../util/functions/trycatch";
import ProductSalesModel from "../models/ProductSales";
import { checkErrProperties } from "../helpers/customError";
import { Request, Response } from "express";
import ResponseHandler from "../util/classes/modelResponseHandlers";

class StockEvaluationController {

private salesModel = ProductSalesModel

constructor(private req:Request, private res:Response){}
    public async getProductSales(){
        const {data: salesInfo, error:fetchErr } = await trycatchHelper<ProductSales[]>(
            () => this.salesModel.getAllProductSales()
        )
        if(fetchErr) return checkErrProperties(this.res,fetchErr);
        new ResponseHandler<ProductSales[] | null>(this.res,salesInfo).getResponse();
    }


    public async getDailySaleSumarryGraphReport(){

    }

    public async getWeeklySaleSummaryGraphReprt() {

    }

    public async getWeekSaleSummaryGrapgReport() {

    }

    public async getAllProductGraphReport(){

    }

    public async getWeeklyProductSaleReport(){

    }

    public async getWeekProductSaleReport() {

    }

    //@ TODO:Create other graph report for products & inventory
}

export default StockEvaluationController