// 文章
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
moment.locale('zh-cn')

const PostSchema = new Schema(
    {
        title: {
            type: String,
            require: true
        },
        created_at: {
            type: Date,
            require: true
        },
        content: {
            type: Buffer,
            require: true
        }
    },
    { collection: 'post', versionKey: false }
)

PostSchema.path('created_at').get(function(v) {
    return moment(v).format('lll')
})

module.exports = mongoose.model('post', PostSchema)
