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
    .post(async (req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.createDiscount();
    })
    .delete(VerifyRoleMiddleware.verifyAdminRole, async (req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.deleteAllDiscounts();
    })


DiscountRouter.route('/:discountId')
    .get(async (req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.getDiscountById();
    })
    .put(VerifyRoleMiddleware.verifyAdminRole,async (req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.updateDiscountById();
    })
    .delete(VerifyRoleMiddleware.verifyAdminRole, async(req,res) => {
        const discountController = new DiscountController(req,res);
        await discountController.deleteDiscountById();
    })


export default DiscountRouter