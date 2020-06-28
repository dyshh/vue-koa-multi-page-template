const IS_PROD = process.env.NODE_ENV === 'production'

const PORT = 8080

module.exports = {
    IS_PROD,
    PORT
}
