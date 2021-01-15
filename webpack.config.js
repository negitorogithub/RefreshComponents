const path = require("path");
const webpack = require("webpack");
//const ReactRefreshWebpackPlugin =  require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  mode: "development",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.ts?$/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
};
