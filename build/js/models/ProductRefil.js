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
const RecordIdGenerator_1 = __importDefault(require("./generators/RecordIdGenerator"));
const prismaErrHandler_1 = __importDefault(require("../helpers/prismaErrHandler"));
const productRefillInventory = client_1.Prisma.validator()({
    include: {
        product: {
            select: {
                buyingPrice: true,
                productName: true,
                supplierId: true,
                inventory: {
                    select: {
                        lastRefilDate: true,
                        quantity: true
                    }
                }
            }
        }
    }
});
const productRefillInclude = client_1.Prisma.validator()({
    product: {
        select: {
            buyingPrice: true,
            productName: true,
            supplierId: true,
            inventory: {
                select: {
                    lastRefilDate: true,
                    quantity: true
                }
            }
        }
    }
});
class ProductRefillsModel {
    static createProductRefill(productId, refillAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: newProductRefil, error: postError } = yield (0, trycatch_1.default)(() => this.model.create({
                data: {
                    id: new RecordIdGenerator_1.default("REFILL").generate(),
                    refilAmount: refillAmount,
                    productId: productId,
                },
            }));
            if (postError)
                (0, prismaErrHandler_1.default)(postError);
            return newProductRefil;
        });
    }
    static getAllProductRefillsByDate(startDate, endDate, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productsRefills, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    refilDate: {
                        gte: endDate,
                        lte: startDate
                    }
                },
                include: joinProperties ? productRefillInclude : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productsRefills;
        });
    }
    static getProductRefillsByProductIdAndDate(productId, startDate, endDate, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productRefills, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    productId: productId,
                    refilDate: {
                        gte: endDate,
                        lte: startDate
                    }
                },
                include: joinProperties ? productRefillInclude : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productRefills;
        });
    }
    static getProductRefillByProductId(productId, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productRefillInfos, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    productId: productId
                },
                include: joinProperties ? productRefillInclude : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productRefillInfos;
        });
    }
    static getProductRefillById(refillId, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productRefillInfo, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: refillId
                },
                include: joinProperties ? productRefillInclude : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productRefillInfo;
        });
    }
    static updateProductRefillStatusById(refillId, status, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedRefillStatus, error: updateError } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: refillId
                },
                data: {
                    status: status
                },
                include: joinProperties ? productRefillInclude : undefined
            }));
            if (updateError)
                (0, prismaErrHandler_1.default)(updateError);
            return updatedRefillStatus;
        });
    }
    static deleteProductRefillById(refillId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedRefillInfo, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.delete({
                where: {
                    id: refillId
                }
            }));
            if (deleteError)
                (0, prismaErrHandler_1.default)(deleteError);
            return deletedRefillInfo;
        });
    }
}
ProductRefillsModel.model = prismaConfig_1.default.productRefil;
exports.default = ProductRefillsModel;
