import { Router } from "express";
import StockEvaluationController from "../../controllers/EvaluationController";
import verifyJWT from "../../middlewares/verifyJWT";


const GraphRouter = Router();

GraphRouter.use(verifyJWT);

GraphRouter.route("/")
    .get(async(req,res) => {
        const stockEvaluationController = new StockEvaluationController(req,res);
        return stockEvaluationController.getProductSales();
    })


export default GraphRouter