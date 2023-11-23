"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaConfig_1 = __importDefault(require("../config/prismaConfig"));
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
const prismaErrHandler_1 = __importDefault(require("../helpers/prismaErrHandler"));
const RecordIdGenerator_1 = __importDefault(require("./generators/RecordIdGenerator"));
const productSaleProduct = client_1.Prisma.validator()({
    include: {
        product: {
            select: {
                price: true,
                productName: true
            }
        }
    }
});
const productSaleIncludeProduct = client_1.Prisma.validator()({
    product: {
        select: {
            price: true,
            productName: true
        }
    }
});
class ProductSalesModel {
    static createProductSale(sales, productId, lastPurchaseDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: newProductSale, error: postError } = yield (0, trycatch_1.default)(() => this.model.create({
                data: {
                    id: new RecordIdGenerator_1.default("SALE").generate(),
                    lastPurchaseDate: lastPurchaseDate ? lastPurchaseDate : new Date(),
                    sales: sales,
                    productId: productId
                }
            }));
            if (postError)
                (0, prismaErrHandler_1.default)(postError);
            return newProductSale;
        });
    }
    static getAllProductSales(joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productSales, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findMany({
                include: joinProperties ? productSaleIncludeProduct : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productSales;
        });
    }
    static getProductSalesByDate(startDate, endDate, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productSale, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    lastPurchaseDate: {
                        gte: endDate,
                        lte: startDate
                    }
                },
                include: joinProperties ? productSaleIncludeProduct : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productSale;
        });
    }
    static getProductSaleById(saleId, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: saleInfo, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: saleId
                },
                include: joinProperties ? productSaleIncludeProduct : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return saleInfo;
        });
    }
    static updateProductSaleById(updateInfo, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedSaleInfo, error: updateError } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: updateInfo.saleId
                },
                data: updateInfo.info,
                include: joinProperties ? productSaleIncludeProduct : undefined
            }));
            if (updateError)
                (0, prismaErrHandler_1.default)(updateError);
            return updatedSaleInfo;
        });
    }
    static deleteProductSaleById(saleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedSaleInfo, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.delete({
                where: {
                    id: saleId,
                }
            }));
            if (deleteError)
                (0, prismaErrHandler_1.default)(deleteError);
            return deletedSaleInfo;
        });
    }
    static deleteAllProductSalesByDate(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedSalesInfos, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.deleteMany({
                where: {
                    lastPurchaseDate: {
                        gte: endDate,
                        lte: startDate
                    }
                }
            }));
            if (deleteError)
                (0, prismaErrHandler_1.default)(deleteError);
            return deletedSalesInfos;
        });
    }
}
ProductSalesModel.model = prismaConfig_1.default.productSales;
exports.default = ProductSalesModel;
