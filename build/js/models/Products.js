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
const RecordIdGenerator_1 = __importDefault(require("./generators/RecordIdGenerator"));
/**
 * Performs CRUD operations on the Product model
 */
class ProductModel {
    static createProduct(productInfoObj) {
        return __awaiter(this, void 0, void 0, function* () {
            // Creates a new product with its relational subset fields if none of them exists
            const { data: productInfo, error: postErr } = yield (0, trycatch_1.default)(() => this.model.create({
                data: {
                    id: new RecordIdGenerator_1.default("PRODUCT").generate(),
                    productName: productInfoObj.productName,
                    productDescription: productInfoObj.productDescription,
                    price: productInfoObj.price,
                    buyingPrice: productInfoObj.buyingPrice,
                    asset: {
                        create: {
                            id: new RecordIdGenerator_1.default("ASSET").generate(),
                            image: productInfoObj.image,
                        },
                    },
                    category: {
                        connectOrCreate: {
                            where: {
                                categoryName: productInfoObj.category,
                            },
                            create: {
                                id: new RecordIdGenerator_1.default("CATEGORY").generate(),
                                categoryName: productInfoObj.category,
                                categoryDescription: productInfoObj.categoryDescription,
                            },
                        },
                    },
                    inventory: {
                        create: {
                            id: new RecordIdGenerator_1.default("INVENTORY").generate(),
                            quantity: productInfoObj.inventoryQty,
                            productName: productInfoObj.productName,
                            lastRefilDate: new Date()
                        },
                    },
                    supplier: {
                        connectOrCreate: {
                            where: {
                                id: productInfoObj.supplierId ? productInfoObj.supplierId : ""
                            },
                            create: {
                                id: new RecordIdGenerator_1.default("SUPPLIER").generate(),
                                companyName: productInfoObj.companyName,
                                address: productInfoObj.address,
                                phone: productInfoObj.phone
                            }
                        }
                    },
                    discountIds: {
                        connect: {
                            id: productInfoObj.discountId ? productInfoObj.discountId : ""
                        }
                    }
                },
            }));
            if (postErr)
                (0, prismaErrHandler_1.default)(postErr);
            return productInfo;
        });
    }
    static getAllProducts(joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productInfos, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findMany({
                include: joinProperties,
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productInfos;
        });
    }
    static getProduct(id, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productInfo, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: id,
                },
                include: properties,
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productInfo;
        });
    }
    static getProductQuantity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: productQty, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: id,
                },
                include: {
                    inventory: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return productQty;
        });
    }
    static updateProductInfo(id, productInfo, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedProductInfo, error: updateError } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: id,
                },
                data: productInfo,
                include: properties,
            }));
            if (updateError)
                (0, prismaErrHandler_1.default)(updateError);
            return updatedProductInfo;
        });
    }
    static updateProductQty(productUpdateInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            //Updates the selected quantity of the selected product
            const { data: updatedProductQty, error: updateError } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: productUpdateInfo.productId,
                },
                data: {
                    inventory: {
                        update: {
                            where: {
                                id: productUpdateInfo.inventoryId,
                            },
                            data: {
                                quantity: productUpdateInfo.qty,
                            },
                        },
                    },
                },
                include: {
                    inventory: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            }));
            if (updateError)
                (0, prismaErrHandler_1.default)(updateError);
            return updatedProductQty;
        });
    }
    static updateManyProducts(products, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProductsPromises = products.map((product) => __awaiter(this, void 0, void 0, function* () {
                const { data: updatedInfo, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.update({
                    where: {
                        id: product.id,
                    },
                    data: product.updateInfo,
                    include: properties,
                }));
                if (updateErr)
                    (0, prismaErrHandler_1.default)(updateErr);
                return updatedInfo;
            }));
            const updatedProducts = yield Promise.all(updatedProductsPromises);
            return updatedProducts;
        });
    }
    static deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfo, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.delete({
                where: {
                    id: id,
                },
            }));
            if (deleteErr)
                (0, prismaErrHandler_1.default)(deleteErr);
            return deletedInfo;
        });
    }
    static deleteProducts(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedProductsPromises = productIds.map((productId) => __awaiter(this, void 0, void 0, function* () {
                const { data: deletedInfos, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.delete({
                    where: {
                        id: productId,
                    },
                }));
                if (deleteErr)
                    (0, prismaErrHandler_1.default)(deleteErr);
                return deletedInfos;
            }));
            const deletedProducts = yield Promise.all(deletedProductsPromises);
            return deletedProducts;
        });
    }
    static deleteAllProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfos, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.deleteMany());
            if (deleteErr)
                (0, prismaErrHandler_1.default)(deleteErr);
            return deletedInfos;
        });
    }
}
ProductModel.model = prismaConfig_1.default.product;
exports.default = ProductModel;
