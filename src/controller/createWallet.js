const walletService         = require('../services/wallet')
const Errors                = require('./../Errors/index')
const { httpStatusCode }    = require('./../constants')
const { OK, CREATED, BAD_REQUEST, NOT_FOUND }   = httpStatusCode
const { NAME_MISSING, AMOUNT_MISSING,WALLETID_MISSING, BALANCE_MISSING, DESCRIPTION_MISSING } = Errors

const createNewWalletCtrl = (req, res) => {
    try {
        if(req?.body && req.body?.name && req.body?.balance){
            const { name, balance } = req.body
            const response = walletService.createNewWallet(name, balance);
            res.status(CREATED).send(response);
        } else {
            const errorResponse = []
            if(req.body === undefined){
                errorResponse.push([NAME_MISSING, BALANCE_MISSING])
            } else {
                if(req.body.name === undefined){
                    errorResponse.push([Errors.NAME_MISSING])
                }
                if(req.body.balance === undefined){
                    errorResponse.push([Errors.BALANCE_MISSING])
                }
            }
            res.status(BAD_REQUEST).send({message: errorResponse});
        }
    } catch (error) {
        console.log('[Ctrl] Error in createNewWalletCtrl: ', error);
        res.status(BAD_REQUEST).send({message: error.message});
    }
}

const fetchWalletByIdCtrl = (req, res) => {
    try {
        if(req?.params?.walletId){
            const walletId = req.params.walletId
            const response = walletService.fetchWalletById(walletId);
            res.status(OK).send(response);
        } else {
            res.status(BAD_REQUEST).send({message: WALLETID_MISSING})
        }
    } catch (error) {
        console.log('[Ctrl] Error in fetchWalletByIdCtrl: ', error);
        res.status(NOT_FOUND).send({ message: error.message })
    }
}

const createTransactionCtrl = (req, res) => {
    try{
        if(req?.params?.walletId && req?.body?.amount && req?.body?.description){
            const walletId      = req.params.walletId
            const amount        = Number(req.body.amount)
            const description   = req.body.description

            const response = walletService.createTransaction(walletId, amount, description)
            res.status(CREATED).send(response)
        }else{
            const errorResponse = []

            if(req.params.walletId === undefined){
                errorResponse.push(Errors.WALLETID_MISSING)
            }
            if(req.body.amount === undefined){
                errorResponse.push(AMOUNT_MISSING)
            }
            if(req.body.description === undefined){
                errorResponse.push(DESCRIPTION_MISSING)
            }

            res.status(BAD_REQUEST).send({message: errorResponse})
        }
    } catch(error) {
        console.log('[Ctrl] Error in createTransactionCtrl: ', error)
        res.status(NOT_FOUND).send({message:error.message})
    }
}

const fetchTransactionsForWalletCtrl = (req, res) => {
    try {
        if(req?.params?.walletId){
            const walletId = req.params.walletId
            const response = walletService.fetchTransactionsForWallet(walletId);
            res.status(OK).send(response);
        } else {
            if(req.params.walletId === undefined){
                errorResponse.push(Errors.WALLETID_MISSING)
            }
            res.status(BAD_REQUEST).send({ message: errorResponse });
        }
    } catch (error) {
        console.log('[Ctrl] Error in fetchTransactionsForWalletCtrl: ', error);
        res.status(NOT_FOUND).send({ message: error.message });
    }
}

module.exports = {
    createNewWalletCtrl, 
    fetchWalletByIdCtrl, 
    createTransactionCtrl,
    fetchTransactionsForWalletCtrl
}