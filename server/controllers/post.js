class PostController {
    async post(ctx) {
        ctx.body = 'hello koa'
    }
}
module.exports = new PostController()
