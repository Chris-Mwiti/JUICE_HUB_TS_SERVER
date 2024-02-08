import { Request, Response } from "express";
import {
  INewProductInfoObj,
  IProduct,
  TJoinModel,
  TJoinProductTypes,
} from "../models/Interfaces/IModels";
import trycatchHelper from "../util/functions/trycatch";
import ProductModel, { ProductRecordWithoutId } from "../models/Products";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import logger from "../util/functions/logger";

/**
 * Product Controller:
 */

class ProductController {
  // Product Model
  private model = ProductModel;
  constructor(private req: Request, private res: Response) {
    this.req = req;
    this.res = res;
  }


  public async createProduct() {
    let productInfoObj: INewProductInfoObj = this.req.body;

    logger("products").info("Creating product");
    //Type casts the product price into number type
    productInfoObj = {
      ...productInfoObj,
      price: Number(productInfoObj.price),
      inventoryQty: Number(productInfoObj.inventoryQty),
    };

    const { data: newProduct, error: postErr } = await trycatchHelper<IProduct>(
      () => this.model.createProduct(productInfoObj)
    );
    if (postErr)
      return this.res.status(500).json({ err: "Error while creating product" });

    new ResponseHandler<IProduct | null>(this.res, newProduct).postResponse();
  }

  public async getProducts() {
    const { data: products, error: fetchErr } = await trycatchHelper<
      IProduct[]
    >(() => this.model.getAllProducts());
    if (fetchErr)
      return this.res
        .status(500)
        .json({ err: " An error occured while fetching products" });

    new ResponseHandler<IProduct[] | null>(this.res, products).getResponse();
  }

  public async getProduct() {
    const { productId } = this.req.params;
    const { data: product, error: fetchErr } = await trycatchHelper<IProduct>(
      () => this.model.getProduct(productId)
    );
    if (fetchErr)
      return this.res
        .status(500)
        .json({ err: " An error occured while fetching product" });

    new ResponseHandler<IProduct | null>(this.res, product).getResponse();
  }

  public async updateProduct() {
    const { productId } = this.req.params;
    const productInfo: Partial<ProductRecordWithoutId> = this.req.body;
    const { data: updatedProduct, error: updateErr } =
      await trycatchHelper<IProduct>(() =>
        this.model.updateProductInfo(productId, productInfo)
      );
    if (updateErr)
      return this.res
        .status(500)
        .json({ err: "An error occured while updating product" });

    new ResponseHandler<IProduct | null>(
      this.res,
      updatedProduct
    ).updateResponse();
  }

  public async deleteProduct() {
    const { productId } = this.req.params;
    const { data: deletedProduct, error: deleteErr } =
      await trycatchHelper<IProduct>(() => this.model.deleteProduct(productId));
    if (deleteErr)
      return this.res
        .status(500)
        .json({ err: "An error occured while deleting product" });

    new ResponseHandler<IProduct | null>(
      this.res,
      deletedProduct
    ).deleteResponse();
  }

  public async deleteAllProducts() {
    const { data: deletedProducts, error: deleteErr } = await trycatchHelper<
      IProduct[]
    >(() => this.model.deleteAllProduct());
    if (deleteErr)
      return this.res
        .status(500)
        .json({ err: "An error occured while deleting products" });

    new ResponseHandler<IProduct[] | null>(
      this.res,
      deletedProducts
    ).deleteResponse();
  }
}

export default ProductController;
