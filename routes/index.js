const express = require("express");
const router = express.Router();
const walletController = require('./../controller/createWallet');

router.get("/ping", function (req,res) {
    res.send('Service running!!!')
})

router.post('/wallet',                          walletController.createNewWalletController);
router.get('/wallet/:walletId',                 walletController.fetchWalletByIdController);
router.post('/wallet/:walletId/transaction',    walletController.createTransactionController);
router.get('/wallet/:walletId/transaction',     walletController.fetchTransactionsForWalletController);


module.exports = router;
