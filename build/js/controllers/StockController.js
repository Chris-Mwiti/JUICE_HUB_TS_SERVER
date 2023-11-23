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
const Inventory_1 = __importDefault(require("../models/Inventory"));
const Products_1 = __importDefault(require("../models/Products"));
const logger_1 = __importDefault(require("../util/functions/logger"));
const ProductRefil_1 = __importDefault(require("../models/ProductRefil"));
const modelResponseHandlers_1 = __importDefault(require("../util/classes/modelResponseHandlers"));
// @TODO: Fetch the products from the cached database
class StockController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.model = Inventory_1.default;
        this.productModel = Products_1.default;
        this.productRefill = ProductRefil_1.default;
    }
    updateProductInventory() {
        return __awaiter(this, void 0, void 0, function* () {
            if ("quantity" in this.req.body && "productId" in this.req.body) {
                //@TODO: Refactor the following code
                const { quantity, productId } = this.req.body;
                const { data: productInfo, error: fetchErr } = yield (0, trycatch_1.default)(() => this.productModel.getProduct(productId, { inventory: true }));
                if (fetchErr) {
                    (0, logger_1.default)("fetchError").warn("Error while fetching product info");
                    return this.res.status(500).json({ err: "Error while fetching product info" });
                }
                //Update product quantity
                if (productInfo) {
                    const { data: updateInfo, error: updateErr } = yield (0, trycatch_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.productRefill.createProductRefill(productId, quantity);
                        const info = yield this.model.refilProductQty(productInfo.inventoryId, quantity);
                        return info;
                    }));
                    if (updateErr) {
                        (0, logger_1.default)("updateError").warn("Error while updating product info");
                        return this.res.status(500).json({ err: "Error while updating product info" });
                    }
                    new modelResponseHandlers_1.default(this.res, updateInfo).updateResponse();
                }
            }
            else {
                this.res.status(400).json({ err: "Missing field in the request" });
            }
        });
    }
}
exports.default = StockController;
