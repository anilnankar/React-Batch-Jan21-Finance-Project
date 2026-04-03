const asyncHandler = require("../../utils/async-handler");
const AppError = require("../../utils/app-error");
const { createBeneficiary, listBeneficiariesByAccountId } = require("./beneficiaries.service");

const createBeneficiaryHandler = asyncHandler(async (req, res) => {
  const beneficiary = await createBeneficiary(req.body);

  res.status(201).json({
    success: true,
    message: "Beneficiary created successfully",
    data: beneficiary,
  });
});

const listBeneficiariesByAccountIdHandler = asyncHandler(async (req, res) => {
  const accountId = Number(req.params.accountId);

  if (!Number.isInteger(accountId) || accountId <= 0) {
    throw new AppError("Invalid account id", 400);
  }

  const rows = await listBeneficiariesByAccountId(accountId);

  res.status(200).json({
    success: true,
    data: rows,
  });
});

module.exports = {
  createBeneficiaryHandler,
  listBeneficiariesByAccountIdHandler,
};
