const AppError = require("../../utils/app-error");
const { findAccountById } = require("../accounts/accounts.repository");
const {
  insertBeneficiary,
  findBeneficiariesByAccountId,
  findBeneficiaryById,
} = require("./beneficiaries.repository");

const createBeneficiary = async (payload) => {
  const account = await findAccountById(payload.account_id);
  if (!account) {
    throw new AppError("Account not found", 404);
  }

  const beneficiaryId = await insertBeneficiary({
    account_id: payload.account_id,
    beneficiary_name: payload.beneficiary_name,
    beneficiary_account_number: payload.beneficiary_account_number,
    ifsc_code: payload.ifsc_code,
    bank_name: payload.bank_name,
    nickname: payload.nickname,
    status: payload.status,
  });

  return findBeneficiaryById(beneficiaryId);
};

const listBeneficiariesByAccountId = async (accountId) => {
  const account = await findAccountById(accountId);
  if (!account) {
    throw new AppError("Account not found", 404);
  }
  return findBeneficiariesByAccountId(accountId);
};

module.exports = {
  createBeneficiary,
  listBeneficiariesByAccountId,
};
