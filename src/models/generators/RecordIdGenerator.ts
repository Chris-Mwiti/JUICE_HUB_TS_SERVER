import crypto from 'crypto'

type RecordIdsPrefixes =
  | "USER"
  | "PRODUCT"
  | "TOKEN"
  | "CATEGORY"
  | "ASSET"
  | "INVENTORY"
  | "DISCOUNT"
  | "SESSION"
  | "CART_ITEM"
  | "ORDER_DETAIL"
  | "ORDER_ITEM"
  | "PAYMENT"
  | "SHIPPING_DTL"
  | "SUPPLIER"
  | "SALE"
  | "REFILL"
  | "REFUND"
  | "IMAGE";

interface IRecordId {
    readonly prefix: RecordIdsPrefixes;
    readonly noOfBytes?: number;
}

// Record Id Generator 
class RecordIdGenerator implements IRecordId {

  public readonly  prefix: RecordIdsPrefixes;
  public readonly noOfBytes: number = 5;

  constructor(prefix: RecordIdsPrefixes, noOfBytes: number = 5){
    this.prefix = prefix;
    this.noOfBytes = noOfBytes
  }

  public generate(){
    const randomId = crypto.randomBytes(this.noOfBytes).toString('hex');
    const id = `${this.prefix}-${randomId}`;

    return id
  }

}

export default RecordIdGenerator;
