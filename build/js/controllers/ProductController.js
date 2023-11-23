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
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
const Products_1 = __importDefault(require("../models/Products"));
const modelResponseHandlers_1 = __importDefault(require("../util/classes/modelResponseHandlers"));
const logger_1 = __importDefault(require("../util/functions/logger"));
/**
 * Product Controller:
 */
class ProductController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        // Product Model
        this.model = Products_1.default;
        this.req = req;
        this.res = res;
    }
    createProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            let productInfoObj = this.req.body;
            (0, logger_1.default)("products").info("Creating product");
            //Type casts the product price into number type
            productInfoObj = Object.assign(Object.assign({}, productInfoObj), { price: Number(productInfoObj.price), inventoryQty: Number(productInfoObj.inventoryQty), discountCouponPercentage: Number(productInfoObj.discountCouponPercentage) });
            const { data: newProduct, error: postErr } = yield (0, trycatch_1.default)(() => this.model.createProduct(productInfoObj));
            if (postErr)
                return this.res.status(500).json({ err: "Error while creating product" });
            new modelResponseHandlers_1.default(this.res, newProduct).postResponse();
        });
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: products, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.getAllProducts());
            if (fetchErr)
                return this.res
                    .status(500)
                    .json({ err: " An error occured while fetching products" });
            new modelResponseHandlers_1.default(this.res, products).getResponse();
        });
    }
    getProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = this.req.params;
            const { data: product, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.getProduct(productId));
            if (fetchErr)
                return this.res
                    .status(500)
                    .json({ err: " An error occured while fetching product" });
            new modelResponseHandlers_1.default(this.res, product).getResponse();
        });
    }
    updateProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = this.req.params;
            const productInfo = this.req.body;
            const { data: updatedProduct, error: updateErr } = yield (0, trycatch_1.default)(() => this.model.updateProductInfo(productId, productInfo));
            if (updateErr)
                return this.res
                    .status(500)
                    .json({ err: "An error occured while updating product" });
            new modelResponseHandlers_1.default(this.res, updatedProduct).updateResponse();
        });
    }
    deleteProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = this.req.params;
            const { data: deletedProduct, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.deleteProduct(productId));
            if (deleteErr)
                return this.res
                    .status(500)
                    .json({ err: "An error occured while deleting product" });
            new modelResponseHandlers_1.default(this.res, deletedProduct).deleteResponse();
        });
    }
    deleteAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedProducts, error: deleteErr } = yield (0, trycatch_1.default)(() => this.model.deleteAllProduct());
            if (deleteErr)
                return this.res
                    .status(500)
                    .json({ err: "An error occured while deleting products" });
            new modelResponseHandlers_1.default(this.res, deletedProducts).deleteResponse();
        });
    }
}
exports.default = ProductController;
