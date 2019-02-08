module.exports = {
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use("i18n")
        .loader("@kazupon/vue-i18n-loader")
        .end();
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'ar',
      localeDir: 'locales',
      enableInSFC: true
    }
  },

  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    //webpack: dev server to proxy any unknown requests (requests that did not match a static file) to http://localhost:8000.
    proxy: {
      '/api': {
        //use localhost or dockerip
        target: 'http://10.10.10.98:8000',
        changeOrigin: true,
        secure: false,
        //logLevel: 'debug',
        //pathRewrite: { "^/api": "" }
        headers: {
          Connection: 'keep-alive',
        }
      }
    }
  },

  configureWebpack: {
    devtool: 'source-map'
  },

  lintOnSave: process.env.NODE_ENV !== 'production'

}