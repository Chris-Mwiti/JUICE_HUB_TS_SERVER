import { Router } from "express";
import NotificationController from "../../controllers/NotificationController";
import verifyJWT from "../../middlewares/verifyJWT";

const NotificationRouter = Router();

NotificationRouter.use(verifyJWT)

NotificationRouter.route("/")
    .get(async(req,res) => {
        const notificationController = new NotificationController(req,res);
        notificationController.getAllNotifications();
    })

export default NotificationRouter