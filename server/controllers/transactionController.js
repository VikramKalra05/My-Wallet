const { default: mongoose } = require("mongoose");
const CATEGORIES = require("../constants/categories");
const { TYPE } = require("../constants/type");
const { AccountModel } = require("../models/accountModel");
const { CategoryModel } = require("../models/categoryModel");
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

  if (!amount || !date || !type.id 
    // || !category?.id 
    || !accountId) {
    return res.status(400).send({
      error: `Missing required fields: title, amount, category.id, type.id, date, accountId`,
    });
  }

  console.log(category)

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

    const subCategoryId = new mongoose.Types.ObjectId(category?.subCategory?.id);

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
    typeName: TYPE[type.id]
  }

  const account = await AccountModel.findOne({"_id" : accountId, userId});

  if(!account){
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
        accountName: account.accountName 
      }
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

    const account = await AccountModel.findByIdAndUpdate(transaction.account.accountId, {
      $inc: { balance: transaction.amount },
    });    

    return res.status(200).json({
      msg: `The transaction has been deleted successfully`,
      transaction,
      account
    });

  } catch (error) {
    return res
      .status(400)
      .send({ error: `Error in deleting transaction, ${error}` });
  }
  // res.json({msg: "You have 0 expenses"})
};

const updateTransaction = async (req, res) => {
  const {userId} = req.body.user;
  const {id, accountId} = req.body;

  if(!id || !accountId){  
    return res.status(400).json({ error: "Both Transaction ID and Account ID are required." });
  }

  const {title, amount, date, type, category, description, status, payee, label} = req.body;

  // // Create update object dynamically
  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (amount !== undefined) updateFields.amount = amount;
  if (date !== undefined) updateFields.date = date;
  if (type !== undefined) updateFields.type = type;
  if (category !== undefined) updateFields.category = category;
  if (description !== undefined) updateFields.description = description;
  if (status !== undefined) updateFields.status = status;
  if (payee !== undefined) updateFields.payee = payee;
  if (label !== undefined) updateFields.label = label;

  try {
    const transaction = await TransactionModel.findById(id);

    var final = {};

    for (key in updateFields){
      if(transaction[key] !== updateFields[key]){
        final[key] = updateFields[key];
      }
    }
    
    res.status(200).json({transaction, final})
  } catch (error) {
    res.status(400).send({ error: `Error in updating transaction, ${error}` });
  }
}

module.exports = {
  createTransaction,
  deleteTransaction,
  getAllUserTransactions,
  getAllTransactions,
  updateTransaction,
};
