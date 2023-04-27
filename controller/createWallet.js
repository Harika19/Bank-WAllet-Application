const walletService         = require('./../services/wallet')
const nameMissing           = "Invalid input : Name is missing"
const amountMissing         = "Invalid input : Amount is missing"
const balanceMissing        = "Invalid input : Balance is missing"
const descriptionMissing    = "Invalid input : Description is missing"
const invalidWalletId       = "Invalid input : WalletId is mandatory"

const createNewWalletCtrl = (req, res) => {
    try {
        if(req?.body && req.body?.name && req.body?.balance){
            const { name, balance } = req.body
            const response = walletService.createNewWallet(name, balance);
            res.status(200).send(response);
        } else {
            const errorResponse = []
            if(req.body === undefined){
                errorResponse.push([nameMissing, balanceMissing])
            } else {
                if(req.body.name === undefined){
                    errorResponse.push([nameMissing])
                }
                if(req.body.balance === undefined){
                    errorResponse.push([balanceMissing])
                }
            }
            res.status(400).send({message: errorResponse});
        }
    } catch (error) {
        console.log('[Ctrl] Error in createNewWalletCtrl: ', error);
        res.status(400).send({message: error.message});
    }
}

const fetchWalletByIdCtrl = (req, res) => {
    try {
        if(req?.params?.walletId){
            const walletId = req.params.walletId
            const response = walletService.fetchWalletById(walletId);
            res.status(200).send(response);
        } else {
            res.status(400).send({message: invalidWalletId})
        }
    } catch (error) {
        console.log('[Ctrl] Error in fetchWalletByIdCtrl: ', error);
        res.status(400).send({ message: error.message })
    }
}

function createTransactionCtrl(req, res) {
    try{
        if(req?.params?.walletId && req?.body?.amount && req?.body?.description){
            const walletId      = req.params.walletId
            const amount        = Number(req.body.amount)
            const description   = req.body.description

            const response = walletService.createTransaction(walletId, amount, description)
            console.log(' Transaction response: ', response)
            res.status(200).send(response)
        }else{
            const errorResponse = []

            if(req.params.walletId === undefined){
                errorResponse.push(invalidWalletId)
            }
            if(req.body.amount === undefined){
                errorResponse.push(amountMissing)
            }
            if(req.body.description === undefined){
                errorResponse.push(descriptionMissing)
            }

            res.status(400).send({message: errorResponse})
        }
    } catch(error) {
        console.log('[Ctrl] Error in createTransactionCtrl: ', error)
        res.status(400).send({message:error.message})
    }
}

function fetchTransactionsForWalletCtrl(req, res) {
    try {
        if(req?.params?.walletId){
            const walletId = req.params.walletId
            const response = walletService.fetchTransactionsForWallet(walletId);
            if(response === undefined){
                const message = "Wallet not found"
                res.status(400).send({message});
            }
            res.status(200).send(response);
        } else {
            if(req.params.walletId === undefined){
                errorResponse.push(invalidWalletId)
            }
            res.status(400).send({ message: errorResponse });
        }
    } catch (error) {
        console.log('[Ctrl] Error in fetchTransactionsForWalletCtrl: ', error);
        res.status(400).send({ message: error.message });
    }
}

module.exports = {
    createNewWalletCtrl, 
    fetchWalletByIdCtrl, 
    createTransactionCtrl,
    fetchTransactionsForWalletCtrl
}