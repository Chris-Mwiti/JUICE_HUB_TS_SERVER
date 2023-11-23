import prismaClient from "../config/prismaConfig";
import prismaErrHandler, {
  PrismaErrorTypes,
} from "../helpers/prismaErrHandler";
import trycatchHelper from "../util/functions/trycatch";
import { InnerJoinActionsProperties } from "../util/types/util.types";
import { IInventory, IProduct, TJoinModel, TJoinProductTypes } from "./Interfaces/IModels";

type TInventoryJoinProperties = {
  product?: boolean | InnerJoinActionsProperties;
};

type TInventoryJoinTypes = {
  product?: IProduct;
};

type TInventoryUpdateObj = {
  inventoryId: string;
  qty: number;
};

class InventoryModel {
  private static model = prismaClient.inventory;

  // @todo: Add functionality that supports bulk stock update
  public static async refilProductQty(
    inventoryId: string,
    qty: number,
    properties?: TInventoryJoinProperties
  ){
    const { data: updatedProductQty, error: updateErr } = await trycatchHelper<
      IInventory | TJoinModel<IInventory, TInventoryJoinTypes>
    >(() =>
      this.model.update({
        where: {
          id: inventoryId,
        },
        data: {
          quantity: qty,
          lastRefilDate: new Date()
        },
        include: properties,
      })
    );
    if (updateErr) prismaErrHandler(updateErr as PrismaErrorTypes);

    return updatedProductQty;
  }

  public static async reduceProductQty(inventoryId: string, qty: number, properties?:TInventoryJoinProperties){
    const { data: updatedProductQty, error: updateErr } = await trycatchHelper<
      IInventory | TJoinModel<IInventory, TInventoryJoinTypes>
    >(() =>
      this.model.update({
        where: {
          id: inventoryId,
        },
        data: {
          quantity: qty,
        },
        include: properties,
      })
    );
    if (updateErr) prismaErrHandler(updateErr as PrismaErrorTypes);

    return updatedProductQty;
  }

  public static async reduceProductQtys(
    updateProductsInfo: TInventoryUpdateObj[],
    properties: TInventoryJoinProperties
  ) {
    const updateInfoPromises = updateProductsInfo.map(async product => {
        const {data: updateInfo, error: updateErr} = await trycatchHelper<IInventory | TJoinModel<IInventory, TJoinProductTypes>>(
            () => this.model.update({
                where: {
                    id: product.inventoryId
                },
                data:{
                    quantity: product.qty
                },
                include: properties
            })
        )

        if(updateErr) prismaErrHandler(updateErr as PrismaErrorTypes)

        return updateInfo
    })

    const updatedInfos = await Promise.all(updateInfoPromises)

    return updatedInfos
  }

  public static async getProductQty(
    inventoryId: string,
    properties?: TInventoryJoinProperties
  ) {
    const { data: productQty, error: fetchErr } = await trycatchHelper<
      IInventory | TJoinModel<IInventory, TInventoryJoinTypes>
    >(() =>
      this.model.findUnique({
        where: {
          id: inventoryId,
        },
        include: properties,
      })
    );
    if (fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);

    return productQty;
  }

  public static async getAllProductsQty(properties?: TInventoryJoinProperties) {
    const { data: productQtys, error: fetchErr } = await trycatchHelper<
      IInventory[] | TJoinModel<IInventory, TInventoryJoinTypes>[]
    >(() =>
      this.model.findMany({
        include: properties,
      })
    );
    if (fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes);

    return productQtys;
  }

  public static async getProductsQty(inventoryIds: string[], properties: TInventoryJoinProperties){
    const fetchPromise = inventoryIds.map(async id => {
        const {data: productQty, error: fetchErr} = await trycatchHelper<IInventory | TJoinModel<IInventory, TInventoryJoinTypes>>(
            () => this.model.findUnique({
                where:{
                    id: id
                },
                include: properties
            })
        )

        if(fetchErr) prismaErrHandler(fetchErr as PrismaErrorTypes)

        return productQty
    })

    const awaitedQtyPromises = await Promise.all(fetchPromise);

    return awaitedQtyPromises
  }

  public static async deleteProductInventory(
    inventoryId: string,
    properties?: TInventoryJoinProperties
  ) {
    const { data: deletedInventory, error: deleteErr } = await trycatchHelper<
      IInventory | TJoinModel<IInventory, TInventoryJoinTypes>
    >(() =>
      this.model.delete({
        where: {
          id: inventoryId,
        },
        include: properties,
      })
    );

    if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

    return deletedInventory;
  }

  public static async deleteAllProductInventory() {
    const { data: deleteInventorys, error: deleteErr } = await trycatchHelper<
      IInventory[]
    >(() => this.model.deleteMany());

    if (deleteErr) prismaErrHandler(deleteErr as PrismaErrorTypes);

    return deleteInventorys;
  }


  //Inventory Evaluations


}

export default InventoryModel