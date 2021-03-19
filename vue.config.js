const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@utils': resolve('utils'),
        '@static': resolve('static')
      }
    }
  },
  devServer: {
    proxy: {
      '/dlWokerSever': {
        target: process.env.BABEL_ENV === 'production' ? 'http://daiter.cn:3000' : 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/dlWokerSever': '/dlWokerSever'
        }
      }
    }
  }
}
