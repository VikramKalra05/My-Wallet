  const { default: mongoose } = require("mongoose");
  const CATEGORIES = require("../constants/categories");
  const { TYPE } = require("../constants/type");
  const { AccountModel } = require("../models/accountModel");
  const { CategoryModel } = require("../models/categoryModel");
  const { TransactionModel } = require("../models/transactionModel");
  const { UserModel } = require("../models/userModel");
  const { updateAnalyticsForTransaction } = require("../utils/analytics");

  const getAllUserTransactions = async (req, res) => {
    const { userId } = req.body.user;

    try {
      const transactions = await TransactionModel.find({ userId });

      res.json({
        msg: `You have ${transactions.length} transactions`,
        transactions,
      });
    } catch (error) {
      return res
        .status(400)
        .send({ error: `Error in fetching total transaction, ${error}` });
    }
  };

  const getTransaction = async (req, res) => {
    const { userId } = req.body.user;
    const { id } = req.params;

    try {
      const transaction = await TransactionModel.findOne({ _id: id, userId });

      if (!transaction) {
        return res
          .status(404)
          .json({ error: "Transaction not found or unauthorized" });
      }

      res.json({
        // msg: `You have ${transactions.length} transactions`,
        transaction,
      });
    } catch (error) {
      return res
        .status(400)
        .send({ error: `Error in fetching transaction, ${error}` });
    }
  };

  const getAllTransactions = async (req, res) => {
    const { userId } = req.body.user;

    try {
      const transactions = await TransactionModel.find({ userId });

      res.json({
        msg: `Total ${transactions.length} transactions`,
        transactions,
      });
    } catch (error) {
      res
        .status(400)
        .send({ error: `Error in fetching total transaction, ${error}` });
    }
  };

  // Balance effect of a transaction on its account:
  // Expense -> decreases balance, Income -> increases, anything else -> no change
  const balanceDelta = (typeName, amount) => {
    if (typeName === "Expense") return -amount;
    if (typeName === "Income") return amount;
    return 0;
  };

  const createTransaction = async (req, res) => {
    const {
      amount,
      date,
      type,
      category,
      status,
      payee,
      label,
      note,
      paymentType,
      accountId,
    } = req.body;
    const { userId } = req.body.user;

    try {
      const amountValue = Number(amount);

      if (
        !date ||
        !type?.id ||
        !accountId ||
        !Number.isFinite(amountValue) ||
        amountValue <= 0
      ) {
        return res.status(400).send({
          error: `Missing or invalid fields: amount (must be a positive number), date, type.id, accountId`,
        });
      }

      if (!TYPE[type.id]) {
        return res.status(400).json({ error: "Invalid type ID" });
      }

      if (!mongoose.isValidObjectId(category?.id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }

      const categoryId = new mongoose.Types.ObjectId(category?.id);

      const categoryDoc = await CategoryModel.findOne({
        _id: categoryId,
        userId,
      });

      if (!categoryDoc) {
        return res.status(400).json({ error: "Invalid category ID" });
      }

      let subCategoryDetails = null;

      if (category?.subCategory?.id) {
        if (!mongoose.isValidObjectId(category.subCategory.id)) {
          return res.status(400).json({ error: "Invalid subCategory ID" });
        }

        const subCategoryId = new mongoose.Types.ObjectId(
          category?.subCategory?.id
        );

        const subCategory = categoryDoc.subCategories.id(subCategoryId);
        if (!subCategory) {
          return res.status(400).json({ error: "Invalid subCategory ID" });
        }

        subCategoryDetails = {
          id: subCategoryId,
          subCategoryName: subCategory?.subCategoryName,
        };
      }

      const categoryDetails = {
        id: categoryId,
        categoryName: categoryDoc?.categoryName,
        subCategory: subCategoryDetails,
      };

      const typeDetails = {
        id: type.id,
        typeName: TYPE[type.id],
      };

      if (!mongoose.isValidObjectId(accountId)) {
        return res.status(400).json({ error: "Account does not exist" });
      }

      const account = await AccountModel.findOne({ _id: accountId, userId });

      if (!account) {
        return res.status(400).json({ error: "Account does not exist" });
      }

      const transaction = new TransactionModel({
        amount: amountValue,
        date,
        type: typeDetails,
        category: categoryDetails,
        userId,
        status,
        payee,
        label,
        note,
        paymentType,
        account: {
          accountId,
          accountName: account.accountName,
        },
      });

      // Persist first so a validation failure cannot leave the balance moved
      await transaction.save();

      await AccountModel.findByIdAndUpdate(accountId, {
        $inc: { balance: balanceDelta(typeDetails.typeName, amountValue) },
      });

      await updateAnalyticsForTransaction({
        userId,
        transaction,
        operation: "create",
      });

      res.json({
        msg: `The transaction has been added`,
        transaction: transaction
      });
    } catch (error) {
      return res
        .status(400)
        .send({ error: `Error in creating transaction, ${error}` });
    }
  };

  const deleteTransaction = async (req, res) => {
    const { id } = req.body;
    const { userId } = req.body.user;

    try {
      const transaction = await TransactionModel.findById(id);

      if (!transaction) {
        return res.status(404).json({ msg: `Transaction not found` });
      }

      if (transaction.userId.toString() !== userId) {
        return res.status(403).json({
          msg: `You are not authorized to delete this transaction`,
        });
      }

      await TransactionModel.findByIdAndDelete(id);

      const typeName = transaction.type.typeName || TYPE[transaction.type.id];

      // Reverse exactly what createTransaction applied
      const account = await AccountModel.findByIdAndUpdate(
        transaction.account.accountId,
        {
          $inc: { balance: -balanceDelta(typeName, transaction.amount) },
        }
      );

      await updateAnalyticsForTransaction({
        userId,
        transaction,
        operation: "delete",
      });

      return res.status(200).json({
        msg: `The transaction has been deleted successfully`,
        transaction,
        account,
      });
    } catch (error) {
      return res
        .status(400)
        .send({ error: `Error in deleting transaction, ${error}` });
    }
    // res.json({msg: "You have 0 expenses"})
  };

  const updateTransaction = async (req, res) => {
    const { userId } = req.body.user;
    const { id, accountId } = req.body;

    if (!id || !accountId) {
      return res
        .status(400)
        .json({ error: "Both Transaction ID and Account ID are required." });
    }

    const { amount, date, type, category, status, payee, label, note, paymentType } = req.body;

    const sameId = (a, b) => String(a ?? "") === String(b ?? "");

    try {
      const transaction = await TransactionModel.findOne({ _id: id, userId });

      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found." });
      }

      if (!mongoose.isValidObjectId(accountId)) {
        return res.status(400).json({ error: "Invalid account ID" });
      }

      const account = await AccountModel.findOne({ _id: accountId, userId });
      if (!account) {
        return res.status(400).json({ error: "Invalid account ID" });
      }

      const oldTypeName = transaction.type.typeName || TYPE[transaction.type.id];
      const oldAmount = transaction.amount;

      let newAmount = oldAmount;
      if (amount !== undefined) {
        newAmount = Number(amount);
        if (!Number.isFinite(newAmount) || newAmount <= 0) {
          return res.status(400).json({ error: "amount must be a positive number" });
        }
      }

      const newTypeId = type?.id ?? transaction.type.id;
      if (!TYPE[newTypeId]) {
        return res.status(400).json({ error: "Invalid type ID" });
      }
      const newTypeName = TYPE[newTypeId];

      const final = {};

      if (date !== undefined) final.date = date;
      if (status !== undefined) final.status = status;
      if (payee !== undefined) final.payee = payee;
      if (label !== undefined) final.label = label;
      if (note !== undefined) final.note = note;
      if (paymentType !== undefined) final.paymentType = paymentType;
      if (amount !== undefined && newAmount !== oldAmount) final.amount = newAmount;

      // Handle type change
      if (type?.id && !sameId(type.id, transaction.type.id)) {
        final.type = {
          typeName: newTypeName,
          id: newTypeId,
        };
      }

      // Handle category changes
      if (
        category?.id &&
        (!sameId(category.id, transaction.category.id) ||
          !sameId(category.subCategory?.id, transaction.category?.subCategory?.id))
      ) {
        if (!mongoose.isValidObjectId(category.id)) {
          return res.status(400).json({ error: "Invalid category ID" });
        }

        const newCategory = await CategoryModel.findOne({ _id: category.id, userId });

        if (!newCategory) {
          return res.status(400).json({ error: "Invalid category ID" });
        }

        let subCategoryDetails = transaction.category?.subCategory;

        if (category?.subCategory?.id) {
          if (!mongoose.isValidObjectId(category.subCategory.id)) {
            return res.status(400).json({ error: "Invalid subCategory ID" });
          }
          const newSubCategory = newCategory.subCategories.id(category.subCategory.id);
          if (!newSubCategory) {
            return res.status(400).json({ error: "Invalid subCategory ID" });
          }
          subCategoryDetails = {
            id: category.subCategory.id,
            subCategoryName: newSubCategory.subCategoryName,
          };
        }

        final.category = {
          id: category?.id,
          categoryName: newCategory?.categoryName,
          subCategory: subCategoryDetails,
        };
      }

      // Balance: one type-aware delta, applied atomically
      const oldDelta = balanceDelta(oldTypeName, oldAmount);
      const newDelta = balanceDelta(newTypeName, newAmount);
      const prevAccountId = transaction.account.accountId.toString();
      const accountChanged = accountId !== prevAccountId;

      if (accountChanged) {
        final.account = {
          accountId: account._id,
          accountName: account.accountName,
        };

        await AccountModel.updateOne(
          { _id: prevAccountId },
          { $inc: { balance: -oldDelta } }
        );
        await AccountModel.updateOne(
          { _id: account._id },
          { $inc: { balance: newDelta } }
        );
      } else if (newDelta !== oldDelta) {
        await AccountModel.updateOne(
          { _id: account._id },
          { $inc: { balance: newDelta - oldDelta } }
        );
      }

      let newTransaction = transaction;
      if (Object.keys(final).length > 0) {
        newTransaction = await TransactionModel.findByIdAndUpdate(id, final, { new: true });
      }

      await updateAnalyticsForTransaction({
        userId,
        transaction: newTransaction,
        oldTransaction: transaction,
        operation: "update",
      });

      res.status(200).json({
        msg: "The transaction has been updated",
        transaction: newTransaction
      });
    } catch (error) {
      res.status(400).send({ error: `Error in updating transaction, ${error}` });
    }
  };
  

  module.exports = {
    createTransaction,
    getAllTransactions,
    getAllUserTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
  };
