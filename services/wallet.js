const database                  = new Map()
const transactionLog            = new Map()
const transactionIdForWalletIds = new Map()
const wallet = "wallet"
let accountId = 1

function createNewWallet(name, balance) {
    const id = wallet+accountId
    const account = {
        walletId: id,
        name,
        balance: Number(balance),
        createdDate: new Date()
    };
    database.set(id, account)
    accountId++
    console.log('Database: ', database)
    return account
}

function fetchWalletById(walletId) {
    try{
        if(!database.has(walletId)){
            throw new Error('Wallet not found')
        }
        const details = database.get(walletId)
        return details
    }catch(error){
        console.log('[Service] Error in fetchWalletById: ', error)
        throw error
    }
}

function createTransaction(walletId, amount, description){
    try{
        console.log(' 11 ', walletId, amount, description, database)

        if(!database.has(walletId)){
            throw new Error('Invalid WalletID')
        }

        let customerDetail = database.get(walletId)
        if(amount < 0 && customerDetail.balance < Math.abs(amount)){
            throw new Error(' Withdrawal amount cannot exceed the account balance')
        }

        customerDetail.balance += amount
        database.set(walletId, customerDetail)
        
        const transactionType = amount >= 0 ? "Deposit" : "Withdrawal"
        
        const newTransactionNumber = transactionIdForWalletIds.get(walletId) ?? 1
        const transactionId = "txn-"+walletId+"-"+newTransactionNumber

        const transactionDetails = {
            transactionId,
            walletId,
            amount,
            balance: customerDetail.balance,
            description: description,
            createdDate: new Date(),
            transactionType
        }

        console.log(' transactionDetails:  ', transactionDetails)
        
        // Incrementing the transactionId based upon the customer (i.e., walletId)
        transactionIdForWalletIds.set(walletId, transactionId+1)
        
        // Adding this transaction to the log
        const previousTransactionDetails = transactionLog.get(walletId) ?? []
        console.log( 'previousTransactionDetails', previousTransactionDetails )
        previousTransactionDetails.push(transactionDetails)

        transactionLog.set(walletId, previousTransactionDetails)

        console.log('transactionIdForWalletIds: ', transactionIdForWalletIds)
        console.log('transactionLog ', transactionLog)
        console.log('database ', database)
        return transactionDetails
    } catch(error){
        console.log('[Service] Error in createTransaction: ', error)
        throw error
    }
}

function fetchTransactionsForWallet(walletId){
    try{
        if(!database.has(walletId)){
            throw new Error('Invalid WalletID')
        }

        return transactionLog.get(walletId)
    }catch(error) {
        console.log('[Service] Error in fetchTransactionsForWallet: ', error)
        throw error
    }
}

module.exports = { 
    createNewWallet, 
    fetchWalletById,
    createTransaction,
    fetchTransactionsForWallet
}