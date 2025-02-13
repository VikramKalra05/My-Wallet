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

        res.json({
            msg: `New account has been created`,
            account: newAccount
        });
    }catch (error){
        return res.status(400).send({"error" : `Something went wrong while creating new account, ${error}`});
    }
}

const getUserAccounts = async (req, res) => {
    const {userId} = req.body.user;

    try{
        const accounts = AccountModel.find({userId});

        res.json({
            // msg: `New account has been created`,
            accounts: accounts
        });
    }catch (error){
        return res.status(400).send({"error" : `Something went wrong while searching for your accounts, ${error}`});
    }
}

module.exports = {
    createNewAccount,
    getUserAccounts
}