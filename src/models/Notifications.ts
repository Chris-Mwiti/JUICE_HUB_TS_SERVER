import { Notifications } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import { ObjectId } from "bson";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";

export type TNotificationDto = Omit<Notifications, "id" | "createdAt" | "updatedAt">

class NotificationsModel {
    private static model = prismaClient.notifications;

    public static async createNotification(notificationDto:TNotificationDto){
        const {data:notificationInfo, error:createErr} = await trycatchHelper<Notifications>(
            () => this.model.create({
                data:{
                    id: new ObjectId().toHexString(),
                    ...notificationDto
                }
            })
        )
        if(createErr) throw new DatabaseError({
            message: ["Error while creating notification", createErr as PrismaErrorTypes],
            code: "500"
        })

        return notificationInfo
    }

    public static async getNotifications(){
        const {data:notificationInfos, error:fetchErr} = await trycatchHelper<Notifications[]>(
            () => this.model.findMany()
        )
        if(fetchErr) throw new DatabaseError({
            message: ["Error while fetching notifications", fetchErr as PrismaErrorTypes],
            code: "500"
        })
        return notificationInfos
    }
}

export default NotificationsModel