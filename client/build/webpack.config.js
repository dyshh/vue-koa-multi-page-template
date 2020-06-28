const { resolve } = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoader = require('vue-loader/lib/plugin')

const { IS_PROD } = require('../../config')
const CLIENT_FOLDER = resolve(__dirname, '../')

let webpackConfig = {
    mode: IS_PROD ? 'production' : 'development',
    stats: 'minimal',
    entry: {
        'pages/front': [CLIENT_FOLDER + '/src/pages/front/main.js'],
        'pages/admin': [CLIENT_FOLDER + '/src/pages/admin/main.js']
    },
    output: {
        filename: '[name].[hash:8].js',
        path: resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
            },
            {
                test: /\.less$/,
                use: [IS_PROD ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [IS_PROD ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'images/',
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // 处理 .vue
        new VueLoader(),
        new HtmlWebpackPlugin({
            filename: 'admin.html',
            template: CLIENT_FOLDER + '/src/pages/admin/index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunks: ['pages/admin']
        }),

        new HtmlWebpackPlugin({
            filename: 'front.html',
            template: CLIENT_FOLDER + '/src/pages/front/index.html',
            chunks: ['pages/front'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    }
}

if (IS_PROD) {
    webpackConfig.plugins.push(
        // 每次 build 清空 output 目录
        new CleanWebpackPlugin()
    )
    webpackConfig.plugins.push(
        // 分离单独的 CSS 文件到 output
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    )
}

module.exports = webpackConfig
