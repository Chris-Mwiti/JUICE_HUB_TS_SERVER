import { Request, Response } from "express";
import {
  INewProductInfoObj,
  IProduct,
  TJoinModel,
  TJoinProductTypes,
} from "../models/Interfaces/IModels";
import trycatchHelper from "../util/functions/trycatch";
import ProductModel, {
  ProductRecordWithoutId,
  TProductInclude,
} from "../models/Products";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import logger from "../util/functions/logger";
import cloudinary from "../config/cloudinary";
import { Product, ProductAsset } from "@prisma/client";
import { checkErrProperties } from "../helpers/customError";
import mardigalEventEmitter from "../util/events/eventEmitter";

/**
 * Product Controller:
 */
type TUpdateDto = {
  lowLevelAlert: number;
  productName: string;
  productDescription: string;
  inventory: {
    quantity: string;
  };
  productLabel: string;
};

class ProductController {
  // Product Model
  private model = ProductModel;
  constructor(private req: Request, private res: Response) {
    this.req = req;
    this.res = res;
  }

  public async createProduct() {
    logger("products").info("Creating product");
    let productInfoObj: INewProductInfoObj = this.req.body;

    //Creates a low level alert of 85% of the goods
    productInfoObj.lowLevelAlert =
      parseInt(productInfoObj.inventory.quantity) -
      (85 / 100) * parseInt(productInfoObj.inventory.quantity);

    //Stores the images to the cloudinary image provider
    const base64UrlImages = productInfoObj.productImages;
    const uploadResponsePromises = base64UrlImages.map((url) => {
      return cloudinary.uploader.upload(url, {
        upload_preset: "ohteilft",
      });
    });
    const settledUploadResponse = await Promise.all(uploadResponsePromises);
    console.log(settledUploadResponse);
    productInfoObj.imageUrl = settledUploadResponse.map(
      (uploadInfo) => uploadInfo.public_id
    );

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

    //Creates notifications for low level stock alerts
    if (products) {
      mardigalEventEmitter.emit("getProducts", products);
    }

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
    let productDto: Partial<TUpdateDto> = this.req.body;
    const { data: productInfo, error: fetchErr } =
      await trycatchHelper<TProductInclude>(() =>
        this.model.getProduct(productId)
      );
    if (fetchErr) return checkErrProperties(this.res, fetchErr);

    if (productInfo) {
      if ("inventory" in productDto) {
        logger("inventory").info("Updating inventory");
        const { data: updateQtyInfo, error: updateErr } =
          await trycatchHelper<TProductInclude>(() =>
            this.model.updateProductQty({
              productId: productId,
              inventoryId: productInfo.inventoryId,
              qty: parseInt(productDto.inventory!.quantity),
            })
          );
        if (updateErr) return checkErrProperties(this.res, updateErr);
        productDto = {
          productDescription: productDto.productDescription,
          productName: productDto.productName,
          productLabel: productDto.productLabel,
        };
        //Creates a low level alert of 85% of the goods
        if (updateQtyInfo) {
          productDto.lowLevelAlert =
            updateQtyInfo.inventory.quantity -
            (85 / 100) * updateQtyInfo.inventory.quantity;
        }
      }

      logger("product").info("Updating product");
      const { data: updatedProduct, error: updateErr } =
        await trycatchHelper<IProduct>(() =>
          this.model.updateProductInfo(productId, { ...productDto })
        );
      if (updateErr)
        return this.res
          .status(500)
          .json({ err: "An error occured while updating product" });
      console.log(updatedProduct);

      new ResponseHandler<IProduct | null>(
        this.res,
        updatedProduct
      ).updateResponse();
    } else {
      this.res.status(400).json({ err: "Product does not exist" });
    }
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
