const Errors = require('./../errors/index')
const { constants } = require('./../constants')
const { WALLET_PREFIX, TRANSACTION_PREFIX, WITHDRAWAL, DEPOSIT } = constants

const database                  = new Map()
const transactionLog            = new Map()
const transactionIdForWallet    = new Map()

let accountId = 1

/**
 * This function creates a new wallet into the database and returns the wallet details
 * @param {String} name 
 * @param {Number} balance 
 * @returns 
 */
function createNewWallet(name, balance) {
    const id = WALLET_PREFIX + accountId

    const account = {
        walletId: id,
        name,
        balance: Number(balance),
        createdDate: new Date()
    };

    database.set(id, account)
    accountId++

    return account
}

/**
 * This function fetches wallet details
 * @param {*} walletId 
 * @returns 
 */
function fetchWalletById(walletId) {
    try{
        validateWalletId(walletId)

        const details = database.get(walletId)
        return details
    }catch(error){
        console.log('[Service] Error in fetchWalletById: ', error)
        throw error
    }
}

/**
 * This function creates a new transaction and returns the transaction details
 * @param {*} walletId 
 * @param {*} amount 
 * @param {*} description 
 * @returns 
 */
function createTransaction(walletId, amount, description){
    try{
        validateWalletId(walletId)

        let customerDetail = database.get(walletId)
        if(amount < 0 && customerDetail.balance < Math.abs(amount)){
            throw new Error(Errors.WITHDRAWAL_AMOUNT_EXCEED_ERROR)
        }

        customerDetail.balance += amount
        database.set(walletId, customerDetail)
        
        const transactionType = amount >= 0 ? DEPOSIT : WITHDRAWAL
        const transactionId = generateTransactionIdForGivenWallet(walletId)

        const transactionDetails = {
            transactionId,
            walletId,
            amount,
            balance: customerDetail.balance,
            description: description,
            createdDate: new Date(),
            transactionType
        }
        
        // Adding this transaction to the log
        const previousTransactionDetails = transactionLog.get(walletId) ?? []
        previousTransactionDetails.push(transactionDetails)
        transactionLog.set(walletId, previousTransactionDetails)

        return transactionDetails
    } catch(error){
        console.log('[Service] Error in createTransaction: ', error)
        throw error
    }
}

/**
 * This function fetches transaction log for a particular wallet 
 * @param {*} walletId 
 * @returns 
 */
function fetchTransactionsForWallet(walletId){
    try{
        validateWalletId(walletId)

        return transactionLog.get(walletId)
    }catch(error) {
        console.log('[Service] Error in fetchTransactionsForWallet: ', error)
        throw error
    }
}

/**
 * This function checks if wallet exists or not
 * @param {*} walletId 
 */
function validateWalletId(walletId){
    if(!database.has(walletId)){
        throw new Error(Errors.WALLET_NOT_FOUND)
    }
}

/**
 * This function creates and returns transactionId
 * @param {*} walletId 
 * @returns 
 */
function generateTransactionIdForGivenWallet(walletId){
    const newTransactionNumber = transactionIdForWallet.get(walletId) ?? 1

    // Incrementing the transactionId based upon the customer (i.e., walletId)
    transactionIdForWallet.set(walletId, newTransactionNumber+1)

    const transactionId = TRANSACTION_PREFIX + walletId + "-" + newTransactionNumber

    return transactionId
}

module.exports = { 
    createNewWallet, 
    fetchWalletById,
    createTransaction,
    fetchTransactionsForWallet
}