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
const express_1 = require("express");
const ProductController_1 = __importDefault(require("../../controllers/ProductController"));
const verifyRole_1 = __importDefault(require("../../middlewares/verifyRole"));
const logger_1 = __importDefault(require("../../util/functions/logger"));
const StockController_1 = __importDefault(require("../../controllers/StockController"));
const verifyJWT_1 = __importDefault(require("../../middlewares/verifyJWT"));
/**
 * Product Router
 */
//Initialization of the product router
const ProductRouter = (0, express_1.Router)();
//Roles Middleware initialization
const verifyRole = verifyRole_1.default;
ProductRouter.use(verifyJWT_1.default);
ProductRouter.route('/')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello");
    (0, logger_1.default)("products").info("Hello my products");
    const productController = new ProductController_1.default(req, res);
    yield productController.getProducts();
}))
    .post(verifyRole.verifyAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new ProductController_1.default(req, res);
    yield productController.createProduct();
}))
    .delete(verifyRole.verifyAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new ProductController_1.default(req, res);
    yield productController.deleteAllProducts();
}));
//Routes that require a productId parameter 
ProductRouter.route('/:productId')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new ProductController_1.default(req, res);
    yield productController.getProduct();
}))
    .put(verifyRole.verifyAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new ProductController_1.default(req, res);
    yield productController.updateProduct();
}))
    .delete(verifyRole.verifyAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new ProductController_1.default(req, res);
    yield productController.deleteProduct();
}));
//Product_Inventory Route
ProductRouter.use(verifyRole.verifyAdminRole);
ProductRouter.route('/:productId/inventory')
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stockController = new StockController_1.default(req, res);
    yield stockController.updateProductInventory();
}));
exports.default = ProductRouter;
