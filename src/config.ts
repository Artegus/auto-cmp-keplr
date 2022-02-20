import 'dotenv/config'

const config = {
    passwordWallet: process.env.PASS_WALLET || ''
}

export { config }