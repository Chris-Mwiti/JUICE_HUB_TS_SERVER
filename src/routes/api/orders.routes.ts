import { Router } from "express";
import OrderController from "../../controllers/OrderController";
import verifyJWT from "../../middlewares/verifyJWT";
import VerifyRoleMiddleware from "../../middlewares/verifyRole";

const verifyRole = VerifyRoleMiddleware;
const OrdersRouter = Router();

OrdersRouter.use(verifyJWT);

OrdersRouter.route("/")
  .post(async (req, res) => {
    const ordersController = new OrderController(req, res);
    await ordersController.createOrder();
  })
  .get(verifyRole.verifyAdminRole, async (req, res) => {
    const ordersController = new OrderController(req, res);
    await ordersController.getAllOrders();
  })
  .delete(verifyRole.verifyAdminRole, async (req, res) => {
    const ordersController = new OrderController(req, res);
    await ordersController.deleteAllOrders();
  });

OrdersRouter.route('/:orderId')
  .get(verifyRole.verifyAdminRole, async (req, res) => {
    console.log(req.params);
    const ordersController = new OrderController(req, res);
    await ordersController.getOrderById();
  })
  .put(verifyRole.verifyAdminRole, async (req, res) => {
    const ordersController = new OrderController(req, res);
    await ordersController.updateOrderStatus();
  })
  .delete(verifyRole.verifyAdminRole, async (req, res) => {
    const ordersController = new OrderController(req, res);
    await ordersController.deleteOrderById();
  });

export default OrdersRouter;
