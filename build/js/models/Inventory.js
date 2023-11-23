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
const prismaConfig_1 = __importDefault(require("../config/prismaConfig"));
const prismaErrHandler_1 = __importDefault(require("../helpers/prismaErrHandler"));
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
class InventoryModel {
    // @todo: Add functionality that supports bulk stock update
    static refilProductQty(inventoryId, qty, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedProductQty, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: inventoryId,
                },
                data: {
                    quantity: qty,
                    lastRefilDate: new Date()
                },
                include: properties,
            }));
            if (updateErr)
                (0, prismaErrHandler_1.default)(updateErr);
            return updatedProductQty;
        });
    }
    static reduceProductQty(inventoryId, qty, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedProductQty, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: inventoryId,
                },
                data: {
                    quantity: qty,
                },
                include: properties,
            }));
            if (updateErr)
                (0, prismaErrHandler_1.default)(updateErr);
            return updatedProductQty;
        });
    }
    static reduceProductQtys(updateProductsInfo, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateInfoPromises = updateProductsInfo.map((product) => __awaiter(this, void 0, void 0, function* () {
                const { data: updateInfo, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.update({
                    where: {
                        id: product.inventoryId
                    },
                    data: {
                        quantity: product.qty
                    },
                    include: properties
                }));
                if (updateErr)
                    (0, prismaErrHandler_1.default)(updateErr);
                return updateInfo;
            }));
            const updatedInfos = yield Promise.all(updateInfoPromises);
            return updatedInfos;
        });
    }
    static getProductQty(inventoryId, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productQty, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: inventoryId,
                },
                include: properties,
            }));
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return productQty;
        });
    }
    static getAllProductsQty(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productQtys, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findMany({
                include: properties,
            }));
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return productQtys;
        });
    }
    static getProductsQty(inventoryIds, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchPromise = inventoryIds.map((id) => __awaiter(this, void 0, void 0, function* () {
                const { data: productQty, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                    where: {
                        id: id
                    },
                    include: properties
                }));
                if (fetchErr)
                    (0, prismaErrHandler_1.default)(fetchErr);
                return productQty;
            }));
            const awaitedQtyPromises = yield Promise.all(fetchPromise);
            return awaitedQtyPromises;
        });
    }
    static deleteProductInventory(inventoryId, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInventory, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.delete({
                where: {
                    id: inventoryId,
                },
                include: properties,
            }));
            if (deleteErr)
                (0, prismaErrHandler_1.default)(deleteErr);
            return deletedInventory;
        });
    }
    static deleteAllProductInventory() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deleteInventorys, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.deleteMany());
            if (deleteErr)
                (0, prismaErrHandler_1.default)(deleteErr);
            return deleteInventorys;
        });
    }
}
InventoryModel.model = prismaConfig_1.default.inventory;
exports.default = InventoryModel;
