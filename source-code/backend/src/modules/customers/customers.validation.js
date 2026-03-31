const { z } = require("zod");

const createCustomerSchema = z
  .object({
    customer_type: z.enum(["INDIVIDUAL", "BUSINESS"]),
    full_name: z.string().trim().min(2).max(150),
    date_of_birth_or_incorp: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format")
      .optional()
      .nullable(),
    mobile_number: z.string().trim().min(10).max(15),
    email: z.string().trim().email().max(150).optional().nullable(),
    pan_number: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  })
  .strict();

module.exports = {
  createCustomerSchema,
};
