import { Router } from "express";
import CategoryController from "../../controllers/CategoryController";
import verifyJWT from "../../middlewares/verifyJWT";
import VerifyRoleMiddleware from "../../middlewares/verifyRole";

const CategoryRouter = Router();

CategoryRouter.use(verifyJWT);

CategoryRouter.route('/')
    .get(async(req,res) => {
        const categoryController = new CategoryController(req,res);
        await categoryController.getAllCategories()
    })
    .post(VerifyRoleMiddleware.verifyAdminRole,async(req,res) => {
        const categoryController = new CategoryController(req,res);
        await categoryController.createCategory();
    })

export default CategoryRouter