const constants = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    WALLET_PREFIX: 'wallet-',
    TRANSACTION_PREFIX: 'txn-'
}

const httpStatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVICE_UNAVAILABLE: 500
}

module.exports = {
    constants,
    httpStatusCode
}