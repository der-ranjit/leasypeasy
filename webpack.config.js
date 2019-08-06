const path = require('path');

module.exports = {
  entry: './src/main.ts',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'leasypeasy.js',
    path: path.resolve(__dirname, 'dist')
  }
};