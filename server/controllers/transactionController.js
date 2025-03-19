const CATEGORIES = require("../constants/categories");
const { TYPE } = require("../constants/type");
const { AccountModel } = require("../models/accountModel");
const { TransactionModel } = require("../models/transactionModel");
const { UserModel } = require("../models/userModel");

const getAllUserTransactions = async (req, res) => {
  const { userId } = req.body.user;

  try {
    const transactions = await TransactionModel.find({ userId });
    // console.log(transactions);

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
    title,
    amount,
    date,
    type,
    category,
    description,
    status,
    payee,
    label,
    accountId,
  } = req.body;
  const { userId } = req.body.user;

  if (!title || !amount || !date || !type.id || !category.id || !accountId) {
    return res.status(400).send({
      error: `Missing required fields: title, amount, category.id, type.id, date, accountId`,
    });
  }

  if (!TYPE[type.id]) {
    return res.status(400).json({ error: "Invalid type ID" });
  }

  if (!CATEGORIES[category.id]) {
    return res.status(400).json({ error: "Invalid category ID" });
  } else {
    if (category.subCategory) {
      if (!CATEGORIES[category.id].subCategories[category.subCategory.id]) {
        return res.status(400).json({ error: "Invalid subCategory ID" });
      }
    }
  }

  const typeDetails = {
    id: type.id,
    typeName: TYPE[type.id]
  }

  const categoryDetails = {
    id: category.id,
    categoryName: CATEGORIES[category.id].categoryName,
    // subCategory: category.subCategory.id
    //   ? {
    //       id: category.subCategory.id,
    //       subCategoryName:
    //         CATEGORIES[category.id].subCategories[category.subCategory.id],
    //     }
    //   : null,
  };

  const account = await AccountModel.findOne({"_id" : accountId, userId});

  if(!account){
    return res.status(400).json({ error: "Account does not exist" });
  }

  try {
     const transaction = new TransactionModel({
      title,
      amount,
      date,
      type: typeDetails,
      category: categoryDetails,
      userId,
      description,
      status,
      payee,
      label,
      accountId
    });

    await AccountModel.findByIdAndUpdate(accountId, { $inc: { balance: -amount } });

    await transaction.save();

    res.json({
      msg: `The transaction has been added`,
      transaction: transaction,
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

    await AccountModel.findByIdAndUpdate(transaction.accountId, {
      $inc: { balance: transaction.amount },
    });    

    return res.status(200).json({
      msg: `The transaction has been deleted successfully`,
      transaction,
    });

  } catch (error) {
    return res
      .status(400)
      .send({ error: `Error in deleting transaction, ${error}` });
  }
  // res.json({msg: "You have 0 expenses"})
};

module.exports = {
  createTransaction,
  deleteTransaction,
  getAllUserTransactions,
  getAllTransactions,
};
