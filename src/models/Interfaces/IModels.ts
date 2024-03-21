import { PartialFields, RequiredFields } from "../../util/types/util.types";
import { CartItems, Category, Discount, Inventory, OrderDetails, OrderItems, PaymentDetails, Prisma, Product, ProductAsset, RefreshTokens, ShippingDetails, ShoppingSession, SupplierDetails, User } from "@prisma/client";

interface BaseRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/*------ User Types ------ */

interface IUser extends User {}

type UserRecord = Omit<IUser, "createdAt" | "updatedAt">
type UserRecordWithoutId = Omit<UserRecord, "id">
type GoogleUser = Omit<UserRecord, "phone" | "password" | "id">

interface IUserPartialId extends UserRecordWithoutId {
  id?:string;
}

interface IUserLoginCredentials {
  email: string;
  password: string;
}

type IUserSignUpCredentials = PartialFields<RequiredFields<UserRecordWithoutId,"phone">, "googleId" | "profileUrl">

const userSessions = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    session: true
  }
})
type TUserSessions = Prisma.UserGetPayload<typeof userSessions>


/* ------ Refresh Model Types ------- */

interface IRefreshTokens extends RefreshTokens {}

/* ------- Product Model Types ------ */

interface IProduct extends Product {}

interface IProductAsset extends ProductAsset {}


interface INewProductInfoObj  {
  // Product Details
  productName: string;
  productDescription: string;
  productSku:string;
  productLabel?:string;
  productCode?:string;
  buyingPrice:string;
  isPerishable:boolean;
  lowLevelAlert:number;
  sellingPrice: string;
  productImages: string[];
  productQuantity: string;
  category:{
    id:string,
  },
  inventory: {
    quantity:string
  }
  
  //Discount Details
  discountId?:string;
  
  // Category Details
  categoryName?:string
  categoryDescription?:string;
  
  //Supplier Details
  supplierId?:string;
  companyName?:string;
  address?:string;
  phone?:string;

  //Inventory Details
  inventoryQty:number;

  //Asset Details
  assetId?:ProductAsset[];
}

type TJoinProductTypes = {
  inventory?:IInventory;
  asset?:IProductAsset;
  category?: ICategory;
  supplier?:  ISupplierDetails;
  cartItem?:ICartItems;
  orderItems?:IOrderItems;
  discountIds?:IDiscount;
}

/* ------ SupplierDetails Model Types ------- */

interface ISupplierDetails extends SupplierDetails {}

/* ----- Category Model Types ---------- */

interface ICategory extends Category {}

/* ------- Inventory Model Types ------- */

interface IInventory extends Inventory {}

/* ------- Discount Model Types -------- */

interface IDiscount extends Discount {}

/* ------- Shopping Session Model Types ------ */

interface IShoppingSession extends ShoppingSession {}

interface ICartItems extends CartItems {}

/* ------- Order Model Types ------- */

interface IOrderDetails extends OrderDetails {}

interface IOrderItems extends OrderItems {}

/* ------- Payments Model Types -------- */

interface IPaymentDetails extends PaymentDetails {}

/* --------- Shipping Model Types --------- */

interface IShippingDetails extends ShippingDetails {}

/* ------ Model Utility Types -------- */

type TJoin<JT> = {
  [key in keyof JT]: JT[key];
}
type TJoinModel<T,JT> = TJoin<JT> & {
  [P in keyof T]: T[P]
}


export {
  IUser,
  UserRecordWithoutId,
  UserRecord,
  GoogleUser,
  IUserPartialId,
  IUserLoginCredentials,
  IUserSignUpCredentials,
  ICartItems,
  ICategory,
  IDiscount,
  IInventory,
  IOrderDetails,
  IOrderItems,
  IPaymentDetails,
  IProduct,
  IProductAsset,
  IRefreshTokens,
  IShippingDetails,
  IShoppingSession,
  INewProductInfoObj,
  TJoinModel,
  TJoinProductTypes,
  BaseRecord,
};
