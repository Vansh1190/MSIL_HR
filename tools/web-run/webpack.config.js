const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: path.join(__dirname, 'entry.jsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  resolve: {
    extensions: ['.web.js', '.jsx', '.js', '.json'],
    modules: [path.join(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules/react'),
      'react-dom': path.join(__dirname, 'node_modules/react-dom'),
      'react-native$': 'react-native-web',
      'react-native-svg$': path.join(__dirname, 'stubs/svg.js'),
      'react-native-linear-gradient$': path.join(__dirname, 'stubs/linear-gradient.js'),
      'react-native-encrypted-storage$': path.join(__dirname, 'stubs/encrypted-storage.js'),
      'react-native-vector-icons/Ionicons$': path.join(__dirname, 'stubs/ionicons.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        type: 'javascript/auto',
        loader: 'babel-loader',
        options: {
          configFile: false,
          babelrc: false,
          presets: [
            ['@babel/preset-env', {targets: {chrome: '110'}, modules: 'commonjs'}],
            ['@babel/preset-react', {runtime: 'classic'}],
          ],
        },
      },
      {test: [/\.(png|jpe?g|gif|webp)$/, /\.(ttf|woff2?)$/], type: 'asset/resource'},
    ],
  },
  plugins: [new HtmlWebpackPlugin({template: path.join(__dirname, 'index.html'), filename: 'index.html'})],
  performance: {hints: false},
};
