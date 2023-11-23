"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaConfig_1 = __importDefault(require("../config/prismaConfig"));
const trycatch_1 = __importDefault(require("../util/functions/trycatch"));
const RecordIdGenerator_1 = __importDefault(require("./generators/RecordIdGenerator"));
const prismaErrHandler_1 = __importDefault(require("../helpers/prismaErrHandler"));
const productRefundInclude = client_1.Prisma.validator()({
    product: {
        select: {
            price: true,
            productName: true
        }
    }
});
const productRefundJoin = client_1.Prisma.validator()({
    include: {
        product: {
            select: {
                price: true,
                productName: true
            }
        }
    }
});
class ProductRefundsModel {
    static createRefund(refundInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: newRefundInfo, error: postErr } = yield (0, trycatch_1.default)(() => this.model.create({
                data: {
                    id: new RecordIdGenerator_1.default("REFUND").generate(),
                    refundQuantity: refundInfo.refundQuantity,
                    refundAmount: refundInfo.refundAmount,
                    productId: refundInfo.productId,
                    orderId: refundInfo.orderId
                }
            }));
            if (postErr)
                (0, prismaErrHandler_1.default)(postErr);
            return newRefundInfo;
        });
    }
    static getRefundsInfoByDateAndStatus(startDate, endDate, status, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: refundInfos, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    returnDate: {
                        gte: endDate,
                        lte: startDate,
                    },
                    status: status
                },
                include: joinProperties ? productRefundInclude : undefined
            }));
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return refundInfos;
        });
    }
    static getRefundInfoByStatus(status, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: refundInfos, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    status: status
                },
                include: joinProperties ? productRefundInclude : undefined
            }));
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return refundInfos;
        });
    }
    static getRefundInfoByDate(startDate, endDate, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: refundInfos, error: fetchErr } = yield (0, trycatch_1.default)(() => this.model.findMany({
                where: {
                    returnDate: {
                        gte: endDate,
                        lte: startDate
                    }
                },
                include: joinProperties ? productRefundInclude : undefined
            }));
            if (fetchErr)
                (0, prismaErrHandler_1.default)(fetchErr);
            return refundInfos;
        });
    }
    static getRefundInfoById(refundId, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: refundInfo, error: fetchError } = yield (0, trycatch_1.default)(() => this.model.findUnique({
                where: {
                    id: refundId
                },
                include: joinProperties ? productRefundInclude : undefined
            }));
            if (fetchError)
                (0, prismaErrHandler_1.default)(fetchError);
            return refundInfo;
        });
    }
    static updateRefundStatusById(refundId, status, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: updatedRefundInfo, error: updateError } = yield (0, trycatch_1.default)(() => this.model.update({
                where: {
                    id: refundId
                },
                data: {
                    status: status
                },
                include: joinProperties ? productRefundInclude : undefined
            }));
            if (updateError)
                (0, prismaErrHandler_1.default)(updateError);
            return updatedRefundInfo;
        });
    }
    static updateManyRefundStatusByIds(infos, joinProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            // The letter P stands for a Promise
            const PUpdatedRefunds = infos.map((info) => __awaiter(this, void 0, void 0, function* () {
                const { data: updatedInfo, error: updateError } = yield (0, trycatch_1.default)(() => this.model.update({
                    where: {
                        id: info.refundId
                    },
                    data: {
                        status: info.status
                    },
                    include: joinProperties ? productRefundInclude : undefined
                }));
                if (updateError)
                    (0, prismaErrHandler_1.default)(updateError);
                return updatedInfo;
            }));
            const updatedProductInfos = yield Promise.all(PUpdatedRefunds);
            return updatedProductInfos;
        });
    }
    static deleteAllRefundInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfos, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.deleteMany());
            if (deleteError)
                (0, prismaErrHandler_1.default)(deleteError);
            return deletedInfos;
        });
    }
    static deleteRefundInfoById(refundId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfo, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.delete({
                where: {
                    id: refundId
                }
            }));
            if (deleteError)
                (0, prismaErrHandler_1.default)(deleteError);
            return deletedInfo;
        });
    }
    static deleteRefundInfosByIds(refundIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const PDeletedRefundInfo = refundIds.map((id) => __awaiter(this, void 0, void 0, function* () {
                const { data: deletedInfo, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.delete({
                    where: {
                        id: id
                    }
                }));
                if (deleteError)
                    (0, prismaErrHandler_1.default)(deleteError);
                return deletedInfo;
            }));
            const deletedInfos = yield Promise.all(PDeletedRefundInfo);
            return deletedInfos;
        });
    }
    static deleteRefundInfoByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: deletedInfos, error: deleteError } = yield (0, trycatch_1.default)(() => this.model.deleteMany({
                where: {
                    status: status
                }
            }));
            if (deleteError)
                (0, prismaErrHandler_1.default)(deleteError);
            return deletedInfos;
        });
    }
}
ProductRefundsModel.model = prismaConfig_1.default.productRefunds;
exports.default = ProductRefundsModel;
