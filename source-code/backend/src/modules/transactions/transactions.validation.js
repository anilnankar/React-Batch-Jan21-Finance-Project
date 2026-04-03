const { z } = require("zod");

const createTransactionSchema = z
  .object({
    customer_id: z.coerce.number().int().positive(),
    from_account_id: z.coerce.number().int().positive(),
    beneficiary_id: z.coerce.number().int().positive(),
    amount: z.coerce
      .number()
      .finite("Amount must be a valid number")
      .positive("Amount must be greater than zero")
      .max(999999999999.99)
      .refine((n) => {
        const rounded = Math.round(n * 100) / 100;
        return Math.abs(n - rounded) < 1e-8;
      }, {
        message: "Amount must have at most 2 decimal places",
      }),
    currency_code: z.enum(["INR"]).default("INR"),
    transaction_type: z.enum(["PAYMENT", "TRANSFER"]).optional(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
    payment_channel: z.enum(["NETBANKING", "MOBILE", "BRANCH"]).optional(),
    remarks: z.preprocess(
      (val) => (val === "" || val === undefined || val === null ? undefined : val),
      z.string().trim().max(255).optional()
    ),
  })
  .strict();

module.exports = {
  createTransactionSchema,
};
