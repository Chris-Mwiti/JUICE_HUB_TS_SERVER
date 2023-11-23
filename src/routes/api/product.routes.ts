import { Router } from "express"
import ProductController from "../../controllers/ProductController";
import VerifyRoleMiddleware from "../../middlewares/verifyRole";
import logger from "../../util/functions/logger";
import StockController from "../../controllers/StockController";
import verifyJWT from "../../middlewares/verifyJWT";

/**
 * Product Router
 */

//Initialization of the product router
const ProductRouter = Router();

//Roles Middleware initialization
const verifyRole = VerifyRoleMiddleware

ProductRouter.use(verifyJWT);

ProductRouter.route('/')
    .get(async (req,res) => {
        console.log("Hello");
        logger("products").info("Hello my products");
        const productController = new ProductController(req, res);
        await productController.getProducts();
    })
    .post(verifyRole.verifyAdminRole,async (req,res) => {
        const productController = new ProductController(req,res);
        await productController.createProduct();
    })
    .delete(verifyRole.verifyAdminRole,async(req,res) => {
        const productController = new ProductController(req,res);
        await productController.deleteAllProducts();
    })

//Routes that require a productId parameter 
ProductRouter.route('/:productId')
    .get(async(req,res) => {
        const productController = new ProductController(req,res);
        await productController.getProduct();
    })
    .put(verifyRole.verifyAdminRole,async(req,res) => {
        const productController = new ProductController(req,res);
        await productController.updateProduct();
    })
    .delete(verifyRole.verifyAdminRole,async(req,res) => {
        const productController = new ProductController(req,res);
        await productController.deleteProduct();
    })


//Product_Inventory Route

ProductRouter.use(verifyRole.verifyAdminRole);
ProductRouter.route('/:productId/inventory')
    .put(async(req,res) => {
        const stockController = new StockController(req,res);
        await stockController.updateProductInventory();  
    })


export default ProductRouter