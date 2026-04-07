const { z } = require("zod");

const emptyToUndefined = (val) =>
  val === "" || val === undefined || val === null ? undefined : val;

const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const money2 = z.coerce
  .number()
  .finite("Must be a valid number")
  .positive("Must be greater than zero")
  .max(999999999999.99)
  .refine((n) => {
    const rounded = Math.round(n * 100) / 100;
    return Math.abs(n - rounded) < 1e-8;
  }, {
    message: "Must have at most 2 decimal places",
  });

const createLoanSchema = z
  .object({
    loan_type_id: z.coerce.number().int().positive(),
    customer_id: z.coerce.number().int().positive(),
    linked_account_id: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().positive().optional()
    ),
    principal_amount: money2,
    tenure_months: z.coerce.number().int().positive().max(600),
    start_date: z.preprocess(emptyToUndefined, isoDateString.optional()),
    end_date: z.preprocess(emptyToUndefined, isoDateString.optional()),
    loan_status: z
      .enum(["APPLIED", "APPROVED", "DISBURSED", "ACTIVE", "CLOSED", "NPA", "WRITTEN_OFF"])
      .optional(),
  })
  .strict();

module.exports = {
  createLoanSchema,
};
