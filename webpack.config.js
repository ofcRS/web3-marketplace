import path from 'path';

export default {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  stats: 'summary'
}