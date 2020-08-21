const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    vendor: ["react", "react-dom", "react-router-dom"],
  },
  output: {
    filename: "dll.[name].js",

    path: path.resolve(__dirname, "../dll"),
    // 全局变量名称
    library: "[name]_[hash]",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "../dll/**/*")],
    }),
    new webpack.DllPlugin({
      // 和library 一致，输出的manifest.json中的name值
      name: "[name]_[hash]",
      // path 指定manifest.json文件的输出路径
      path: path.resolve(__dirname, "../dll/[name]-manifest.json"),
    }),
  ],
};