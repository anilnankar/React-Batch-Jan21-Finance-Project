const AppError = require("../../utils/app-error");
const { pool } = require("../../config/database");
const {
  findAccountWithCustomer,
  decreaseAvailableBalance,
  findAccountByAccountNumber,
  increaseAvailableBalance,
} = require("../accounts/accounts.repository");
const { findBeneficiaryById } = require("../beneficiaries/beneficiaries.repository");
const { insertTransaction, findTransactionById, findTransactionByCustomerId } = require("./transactions.repository");

const toMoneyAmount = (value) => Math.round(Number(value) * 100) / 100;

const createTransaction = async (payload) => {
  const amount = toMoneyAmount(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("Invalid payment amount", 400);
  }
  
  const transaction_type = payload.transaction_type;
  if (transaction_type.toLowerCase() !== "credit"
       && transaction_type.toLowerCase() !== "debit") {
    throw new AppError("Invalid transaction type", 400);
  }
  
  const account = await findAccountWithCustomer(payload.from_account_id);
  if (!account) {
    throw new AppError("Debit account not found", 404);
  }
  if (Number(account.customer_id) !== Number(payload.customer_id)) {
    throw new AppError("Account does not belong to this customer", 403);
  }
  if (account.status !== "ACTIVE") {
    throw new AppError("Debit account is not active", 400);
  }
  const accountCurrency = String(account.currency_code || "").trim();
  if (accountCurrency !== payload.currency_code) {
    throw new AppError("Account currency does not match payment currency", 400);
  }

  const bene = await findBeneficiaryById(payload.beneficiary_id);
  if (!bene) {
    throw new AppError("Beneficiary not found", 404);
  }
  if (Number(bene.account_id) !== Number(payload.from_account_id)) {
    throw new AppError("Selected payee is not linked to this debit account", 400);
  }
  if (bene.status !== "ACTIVE") {
    throw new AppError("Beneficiary is not active", 400);
  }

  const available = toMoneyAmount(account.available_balance);
  if (!Number.isFinite(available) || available < amount) {
    throw new AppError("Insufficient available balance", 400);
  }

  const connection = await pool.getConnection();
  let transactionId;

  try {
    await connection.beginTransaction();

    transactionId = await insertTransaction(
      {
        customer_id: payload.customer_id,
        from_account_id: payload.from_account_id,
        beneficiary_id: payload.beneficiary_id,
        amount,
        currency_code: payload.currency_code ?? "INR",
        transaction_type: payload.transaction_type ?? "Credit",
        status: payload.status ?? "COMPLETED",
        payment_channel: payload.payment_channel ?? "NETBANKING",
        remarks: payload.remarks,
      },
      connection
    );

    const rowsUpdated = await decreaseAvailableBalance(
      payload.from_account_id,
      amount,
      connection
    );

    if (rowsUpdated !== 1) {
      throw new AppError("Insufficient available balance or account not active", 400);
    }

    const payeeAccountNumber = String(bene.beneficiary_account_number || "").trim();
    const creditAccount = payeeAccountNumber
      ? await findAccountByAccountNumber(payeeAccountNumber, connection)
      : null;

    if (creditAccount) {
      const creditId = Number(creditAccount.account_id);
      const fromId = Number(payload.from_account_id);

      if (creditId !== fromId) {
        const creditCurrency = String(creditAccount.currency_code || "").trim();
        if (creditCurrency !== accountCurrency) {
          throw new AppError("Payee account currency does not match payment currency", 400);
        }
        if (creditAccount.status !== "ACTIVE") {
          throw new AppError("Payee account is not active", 400);
        }
        const credited = await increaseAvailableBalance(creditId, amount, connection);
        if (credited !== 1) {
          throw new AppError("Could not credit payee account", 500);
        }
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const saved = await findTransactionById(transactionId);
  if (!saved) {
    throw new AppError("Transaction was created but could not be loaded", 500);
  }
  return saved;
};

const getTractionsactionByCustomerId = async (customerId) => {
  const connection = await pool.getConnection();
  try {
    const transactions = await findTransactionByCustomerId(customerId, connection);
    return transactions;
  } finally {
    connection.release();
  }   
};
module.exports = {
  createTransaction,
  getTractionsactionByCustomerId
};
