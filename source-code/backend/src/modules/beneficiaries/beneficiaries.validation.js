const { z } = require("zod");

const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const createBeneficiarySchema = z
  .object({
    account_id: z.coerce.number().int().positive(),
    beneficiary_name: z.string().trim().min(2).max(150),
    beneficiary_account_number: z.string().trim().min(5).max(32),
    ifsc_code: z
      .preprocess((val) => (val === "" || val === undefined ? null : val), z.union([z.null(), z.string().trim().toUpperCase().regex(ifscRegex, "Invalid IFSC format")])),
    bank_name: z.string().trim().max(150).optional().nullable(),
    nickname: z.string().trim().max(80).optional().nullable(),
    status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
  })
  .strict();

module.exports = {
  createBeneficiarySchema,
};
