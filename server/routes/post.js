const Router = require('koa-router')
const { post } = require('../controllers/post')

const router = new Router({ prefix: '/api' })

router.get('/post', post)

module.exports = router
