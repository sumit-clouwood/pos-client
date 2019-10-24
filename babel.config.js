module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        targets: {
          ie: '11',
          android: '5.0',
          browsers: 'last 2 versions',
        },
        useBuiltIns: 'entry',
      },
    ],
  ],
}
