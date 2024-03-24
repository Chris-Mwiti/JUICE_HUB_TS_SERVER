import { Request, Response } from "express";
import trycatchHelper from "../util/functions/trycatch";
import { Notifications } from "@prisma/client";
import NotificationsModel from "../models/Notifications";
import { checkErrProperties } from "../helpers/customError";
import ResponseHandler from "../util/classes/modelResponseHandlers";

class NotificationController {

    private model = NotificationsModel

    constructor(private req:Request, private res:Response){}

    public async getAllNotifications(){
        const {data:notificationInfos, error:fetchErr} = await trycatchHelper<Notifications[]>(
            () => this.model.getNotifications()
        )
        if(fetchErr) return checkErrProperties(this.res,fetchErr);

        new ResponseHandler<Notifications[] | null>(this.res,notificationInfos)
        .getResponse()
    }
}

export default NotificationController