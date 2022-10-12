import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: "development",
  entry: './src/index.ts',
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /.[jt]sx?$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      }
    ]
  },
  stats: 'normal',
  output: {
    path: path.resolve('dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
 }
}