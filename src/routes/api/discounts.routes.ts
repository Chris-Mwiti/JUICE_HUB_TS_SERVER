import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT";
import DiscountController from "../../controllers/DiscountController";
import VerifyRoleMiddleware from "../../middlewares/verifyRole";


const DiscountRouter = Router();

DiscountRouter.use(verifyJWT);

DiscountRouter.route('/')
    .get(async (req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.getAllDiscounts();
    })
    .post(VerifyRoleMiddleware.verifyAdminRole, async (req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.createDiscount();
    })