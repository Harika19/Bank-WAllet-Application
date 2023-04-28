const express = require("express");
const router = express.Router();
const walletController = require('./../controller/createWallet');

router.get("/ping", function (req,res) {
    res.send('Service running!!!')
})

router.post('/wallet',                          walletController.createNewWalletCtrl);
router.get('/wallet/:walletId',                 walletController.fetchWalletByIdCtrl);
router.post('/wallet/:walletId/transaction',    walletController.createTransactionCtrl);
router.get('/wallet/:walletId/transaction',     walletController.fetchTransactionsForWalletCtrl);


module.exports = router;
