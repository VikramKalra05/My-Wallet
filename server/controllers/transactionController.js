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
    try {
      const transactions = await TransactionModel.find();

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

    if (
      !amount ||
      !date ||
      !type.id ||
      // || !category?.id
      !accountId
    ) {
      return res.status(400).send({
        error: `Missing required fields: title, amount, category.id, type.id, date, accountId`,
      });
    }

    if (!TYPE[type.id]) {
      return res.status(400).json({ error: "Invalid type ID" });
    }

    const categoryId = new mongoose.Types.ObjectId(category?.id);

    const categoryDoc = await CategoryModel.findOne({ _id: categoryId, userId });

    if (!categoryDoc) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    let subCategoryDetails = null;

    if (category?.subCategory?.id) {
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

    const account = await AccountModel.findOne({ _id: accountId, userId });

    if (!account) {
      return res.status(400).json({ error: "Account does not exist" });
    }

    try {
      const transaction = new TransactionModel({
        amount,
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

      await AccountModel.findByIdAndUpdate(accountId, {
        $inc: { balance: -amount },
      });

      await transaction.save();

      // TBD
      await updateAnalyticsForTransaction({
        userId,
        transaction,
        operation: "create",
        // transactionDate: transaction.date,
      });
      // console.log(transaction.date);

      res.json({
        msg: `The transaction has been added`,
        transaction: transaction
      });
    } catch (error) {
      return res
        .status(400)
        .send({ error: `Error in creating transaction, ${error}` });
    }
    // res.json({msg: "You have 0 expenses"})
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

      const account = await AccountModel.findByIdAndUpdate(
        transaction.account.accountId,
        {
          $inc: { balance: transaction.amount },
        }
      );

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
  
    const updateFields = {};
    if (amount !== undefined) updateFields.amount = amount;
    if (date !== undefined) updateFields.date = date;
    if (status !== undefined) updateFields.status = status;
    if (payee !== undefined) updateFields.payee = payee;
    if (label !== undefined) updateFields.label = label;
    if (note !== undefined) updateFields.note = note;
    if (paymentType !== undefined) updateFields.paymentType = paymentType;
  
    try {
      const transaction = await TransactionModel.findOne({ _id: id, userId });
  
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found." });
      }
  
      const account = await AccountModel.findById(transaction.account.accountId);
      if (!account) {
        return res.status(400).json({ error: "Invalid account ID" });
      }
  
      var final = {};
  
      if (amount !== undefined && amount !== transaction.amount) {
        // Reverse the old amount effect
        if (transaction.type.id === 2) {
          account.balance += transaction.amount; // Add back the old expense
        } else if (transaction.type.id === 1) {
          account.balance -= transaction.amount; // Subtract old income
        }
  
        // Apply the new amount effect
        if (type?.id === 2) {
          account.balance -= amount; // Deduct new expense
        } else if (type?.id === 1) {
          account.balance += amount; // Add new income
        }
  
        await account.save();
      }
  
      // 🛑 **Step 2: Handle Account Changes**
      if (accountId !== transaction.account.accountId.toString()) {
        const prevAccount = await AccountModel.findById(transaction.account.accountId);
        const newAccount = await AccountModel.findById(accountId);
  
        if (!newAccount) {
          return res.status(400).json({ error: "Invalid new account ID" });
        }
  
        // Reverse old transaction effect on previous account
        if (prevAccount) {
          if (transaction.type.id === 2) {
            prevAccount.balance += transaction.amount; // Refund expense
          } else if (transaction.type.id === 1) {
            prevAccount.balance -= transaction.amount; // Deduct income
          }
          await prevAccount.save();
        }
  
        // Apply transaction effect on new account
        if (type?.id === 2) {
          newAccount.balance -= amount; // Deduct expense
        } else if (type?.id === 1) {
          newAccount.balance += amount; // Add income
        }
        await newAccount.save();
  
        final.account = {
          accountId: newAccount._id,
          accountName: newAccount.accountName,
        };
      }
  
      // 🛑 **Step 3: Handle Type Change**
      if (type?.id && type.id !== transaction.type.id) {
        final.type = {
          typeName: TYPE[type.id],
          id: type.id,
        };
      }
  
      // 🛑 **Step 4: Handle Category Changes**
      if (category?.id && (category.id !== transaction.category.id || category.subCategory?.id !== transaction.category?.subCategory?.id)) {
        const newCategory = await CategoryModel.findOne({ _id: category.id, userId });
  
        if (!newCategory) {
          return res.status(400).json({ error: "Invalid category ID" });
        }
  
        let subCategoryDetails = transaction.category?.subCategory;
  
        if (category?.subCategory?.id) {
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
  
      // 🛑 **Step 5: Apply Other Updates**
      for (let key in updateFields) {
        if (transaction[key] !== updateFields[key]) {
          final[key] = updateFields[key];
        }
      }
  
      var newTransaction;
      if (Object.keys(final).length > 0) {
        newTransaction = await TransactionModel.findByIdAndUpdate(id, final, { new: true });
      }
  
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
