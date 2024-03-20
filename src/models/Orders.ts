import { OrderDetails, OrderItems, OrderStatus, PaymentProviders, Prisma, Product, ProductRefunds, ShippingDetails, User } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";

export type TOrderDto = Omit<OrderDetails, "id"> & {
    total: string
    items:OrderItems[],
    provider: PaymentProviders,
    shippingDto: Omit<ShippingDetails, "id" | "userId">
    userId: string;
}

const orderInclude: Prisma.OrderDetailsInclude =
  Prisma.validator<Prisma.OrderDetailsInclude>()({
    user: {
      select: {
        id: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
      },
    },
    payment: true,
    items: {
      include: {
        product: {
          select: {
            productName: true,
            sellingPrice: true,
            inventoryId: true,
            assetIds: {
              select: {
                id: true,
                images:{
                    select: {
                        id:true,
                        imageUrl: true
                    }
                },
              },
            },
          },
        },
      },
    },
    shippingInfo: true,
  });

const OrdersIncludeDto = Prisma.validator<Prisma.OrderDetailsDefaultArgs>()({
    include: orderInclude
});

export type TOrderIncludeDto = Prisma.OrderDetailsGetPayload<typeof OrdersIncludeDto>


class Orders {
    private static model = prismaClient.orderDetails;

    public static async createOrder(orderDto: TOrderDto){
        const {data: orderInfo, error:createErr} = await trycatchHelper<OrderDetails>(
           () => this.model.create<Prisma.OrderDetailsCreateArgs>({
            data: {
                id: new RecordIdGenerator("ORDER_DETAIL").generate(),
                total: parseInt(orderDto.total),
                items: {
                    connect: orderDto.items
                },
                payment: {
                    create: {
                        id: new RecordIdGenerator("PAYMENT").generate(),
                        amount: parseInt(orderDto.total),
                        user: {
                            connect: {id: orderDto.userId}
                        },
                        provider: orderDto.provider   
                    }
                },
                shippingInfo: {
                    create: {
                        id: new RecordIdGenerator("SHIPPING_DTL").generate(),
                        county: orderDto.shippingDto.county,
                        street: orderDto.shippingDto.street,
                        town: orderDto.shippingDto.town,
                        locationDesc: orderDto.shippingDto.locationDesc,
                        user: {
                            connect: {id: orderDto.userId}
                        }
                    }
                },
                userId: orderDto.userId
            }
           })
        )

        if(createErr) throw new DatabaseError({
            message: ["Error while creating new order", createErr as PrismaErrorTypes],
            code: "500"
        })

        return orderInfo
    }

    public static async getAllOrders(){
        const {data: orderInfos, error: fetchError} = await trycatchHelper<TOrderIncludeDto[]>(
            () => this.model.findMany({
                include: orderInclude
            })
            
        );

        if(fetchError) throw new DatabaseError({
            message: ["Error while fetching orders", fetchError as PrismaErrorTypes],
            code: "500"
        })

        return orderInfos
    }

    public static async getOrderById(orderId:string){
        const {data: orderInfo, error: fetchErr} = await trycatchHelper<TOrderIncludeDto>(
            () => this.model.findUnique({
                where: {
                    id: orderId
                },
                include: orderInclude
            })
        )

        if(fetchErr) throw new DatabaseError({
            message: ["Error while fetching order", fetchErr as PrismaErrorTypes],
            code: "500"
        })

        return orderInfo
    }

    public static async updateOrderStatus(orderId:string,status: OrderStatus){
        
        const {data: updatedInfo, error: updateErr} = await trycatchHelper<TOrderIncludeDto>(
            () =>  this.model.update({
                where: {
                    id: orderId
                },
                data: {
                    status: status
                },
                include: orderInclude
            })
        )

        if(updateErr) throw new DatabaseError({
            message: ["Error while updating order", updateErr as PrismaErrorTypes],
            code: "500"
        })

        return updatedInfo
    }

    public static async deleteAllOrders(){
        const {data: deletedInfos, error: deleteErr} = await trycatchHelper<OrderDetails[]>(
            () => this.model.deleteMany()
        )

        if(deleteErr) throw new DatabaseError({
            message: ["Error while deleting orders", deleteErr as PrismaErrorTypes],
            code: "500"
        })

        return deletedInfos
    }

    public static async deleteOrderById(orderId:string){
        const {data: deletedInfo, error: deleteErr} = await trycatchHelper<OrderDetails>(
            () => this.model.delete({
                where: {
                    id: orderId
                }
            })
        )

        if(deleteErr) throw new DatabaseError({
            message: ["Error while deleting order",deleteErr as PrismaErrorTypes],
            code: "500"
        })

        return deletedInfo
    }
}

export default Orders