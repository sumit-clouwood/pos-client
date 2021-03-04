module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/pos/' : '/',
  css: {
    sourceMap: true,
  },
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'ar',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    watchOptions: {
      poll: true,
    },
    //open: process.platform === 'darwin',
    //https: true,
    //hotOnly: false,

    overlay: {
      warnings: true,
      errors: true,
    },
    //webpack: dev server to proxy any unknown requests (requests that did not match a static file) to http://localhost:8000.
    proxy: {
      '/noapi': {
        //use localhost or dockerip
        // /api ll be replaced by localhost/api/url
        target: process.env.VUE_APP_API_ENDPOINT,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        //pathRewrite: { "^/api": "" }
        headers: {
          Connection: 'keep-alive',
        },
      },
    },
  },

  configureWebpack: {
    devtool: 'source-map',
  },

  lintOnSave: process.env.NODE_ENV !== 'production',

  pwa: {
    name: 'DimsPOS',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/services/service-worker.js',
      // ...other Workbox options...
    },
  },
}
