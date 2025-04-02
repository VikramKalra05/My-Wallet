const { AccountModel } = require("../models/accountModel");

const createNewAccount = async (req, res) => {
    const body = req.body;
    const {userId} = req.body.user;

    if(!body.accountName || !body.balance){
        return res.status(400).send({"error" : `Missing required field: Account Name or Balance`});
    }

    const { accountName, balance } = body;

    try{
        const newAccount = new AccountModel({accountName, balance, userId});
        await newAccount.save();

        res.status(200).json({
            msg: `New account has been created`,
            account: newAccount
        });
    }catch (error){
        return res.status(400).send({"error" : `Something went wrong while creating new account, ${error}`});
    }
}

const deleteAccount = async (req, res) => {
    const {id} = req.body;
    const {userId} = req.body.user;

    if(!id){
        return res.status(400).send({"error" : `Missing required field: Account ID`});
    }

    try{
        const account = await AccountModel.findById(id);

        if (!account) {
            return res.status(404).json({ msg: `Account not found` });
        }

        if (account.userId.toString() !== userId) {
            return res.status(403).json({
              msg: `You are not authorized to delete this account`,
            });
        }

        await account.deleteOne();

        res.status(200).json({
            msg: `The account has been deleted`,
            account: account
        });
    }catch (error){
        return res.status(400).send({"error" : `Something went wrong while deleting account, ${error}`});
    }
}

const getUserAccounts = async (req, res) => {
    const {userId} = req.body.user;

    try{
        const accounts = await AccountModel.find({userId});

        res.json({
            accounts: accounts
        });
    }catch (error){
        return res.status(400).send({"error" : `Something went wrong while searching for your accounts, ${error}`});
    }
}

const updateUserAccount = async (req, res) => {
    const {userId} = req.body.user;
    const {id, accountName, balance} = req.body;

    if (!id) {
        return res.status(400).json({ error: "Account ID is required." });
    }

    // Create update object dynamically
    const updateFields = {};
    if (accountName !== undefined) updateFields.accountName = accountName;
    if (balance !== undefined) updateFields.balance = balance;

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "At least one field (accountName, balance) must be provided." });
    }

    try{
        const updatedAccount = await AccountModel.findOneAndUpdate(
            { _id: id, userId }, 
            { $set: updateFields  }, 
            { new: true, runValidators: true } // Return updated account & run schema validations
        );

        if (!updatedAccount) {
            return res.status(404).json({ error: "Account not found or unauthorized." });
        }

        res.status(200).json({ msg: `The account has been updated`, account: updatedAccount });
    }catch (error){
        return res.status(400).send({"error" : `Something went wrong while updating your account, ${error}`});
    }
}

module.exports = {
    createNewAccount,
    updateUserAccount,
    getUserAccounts,
    deleteAccount
}