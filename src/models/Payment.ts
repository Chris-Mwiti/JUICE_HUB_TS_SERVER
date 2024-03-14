import { PaymentDetails } from "@prisma/client";
import prismaClient from "../config/prismaConfig";

export type TPaymentDto = Omit<PaymentDetails, "id">
class PaymentsModel {
    private static model = prismaClient.paymentDetails;

    public static async createPayment(paymentDto:TPaymentDto){
        
    }
}