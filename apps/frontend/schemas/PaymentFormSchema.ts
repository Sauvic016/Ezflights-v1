import * as z from "zod";

export const formSchema = z.object({
  paymentMethod: z.enum([
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_TRANSFER",
    "PAYPAL",
    "WALLET",
  ]),
  cardNumber: z.string().optional(),
  cardHolder: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvv: z.string().optional(),
  bankAccount: z.string().optional(),
  walletType: z.string().optional(),
});
