const Koa = require('koa')
const koaWebpack = require('koa-webpack')
const koaStatic = require('koa-static')
const webpackConfig = require('./client/build/webpack.config.js')
const history = require('koa2-history-api-fallback')
const { IS_PROD, PORT } = require('./config')
const routing = require('./server/routes')
const koaBody = require('koa-body')
const path = require('path')
const catchError = require('./server/middlewares/catcherror')

registerApp()

async function registerApp() {
    const app = new Koa()

    app.use(catchError)

    // 连接mongodb，异步
    // mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    //     if (err) {
    //         console.error(err)
    //     } else {
    //         console.log('Connecting database successfully')
    //     }
    // })
    // 处理post请求和图片上传
    app.use(
        koaBody({
            multipart: true,
            formidable: {
                // 上传目录
                uploadDir: path.join(__dirname, 'public'),
                // 保留文件扩展名
                keepExtensions: true
            }
        })
    )

    // 注册路由
    routing(app)

    // 注册前端路由
    app.use(
        history({
            htmlAcceptHeaders: ['text/html'],
            index: '/front.html',
            rewrites: [
                { from: /^\/admin$/, to: '/admin.html' },
                { from: /^\/$/, to: '/front.html' }
            ]
        })
    )

    if (IS_PROD) {
        // 生产环境静态资源
        app.use(koaStatic('client/dist'))
    } else {
        // 开发环境webpack热更新
        const middleware = await koaWebpack({
            config: webpackConfig,
            devMiddleware: {
                stats: 'minimal'
            }
        })
        app.use(middleware)
    }

    app.listen(PORT)
}
