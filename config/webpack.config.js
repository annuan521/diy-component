const path = require("path");
// 动态生成html文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清除文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 抽取css代码
const MiniCssRxtractPlugin = require("mini-css-extract-plugin");
// 控制台删除无效的打印
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// 压缩css
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 给模块做缓存
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
// 生产包分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
// js压缩
const TerserPlugin = require("terser-webpack-plugin");
//
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
//
const Webpack = require("webpack");

const {
  mode,
  isPro,
  lessLoader,
  cssLoader,
  tsxLoader,
  sourceLoader,
} = require("./utils");

module.exports = {
  // 入口
  // entry: "../src/index.tsx",
  entry: path.resolve(__dirname, "../src/index.tsx"),

  // 出口
  output: {
    filename: "static/js/[name].js",
    path: path.join(__dirname, "../dist"),
  },

  // 生产模式下关闭map文件
  devtool: isPro ? "none" : "source-map",

  // 解析相关
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  // 模块
  module: {
    rules: [
      tsxLoader,
      isPro ? null : sourceLoader,
      cssLoader,
      lessLoader,
    ].filter(Boolean),
  },

  // 插件
  plugins: [
    new MiniCssRxtractPlugin({
      filename: "static/styles/[name].css",
      chunkFilename: "static/styles/[name].css",
    }),
    new Webpack.DllReferencePlugin({
      manifest: path.join(__dirname, "../dll/vendor-manifest.json"),
    }),
    new HtmlWebpackPlugin({
      // template: "../public/index.html",
      template: path.resolve(__dirname, "../public/index.html"),

      inject: true,
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 移除空格
      },
    }),
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, "../dll/dll.vendor.js"),
    }),
    // new FriendlyErrorsPlugin(),
    mode === "development" ? new Webpack.HotModuleReplacementPlugin() : null,
    mode === "development" ? new HardSourceWebpackPlugin() : null,
    mode === "production" ? new CleanWebpackPlugin() : null,
    mode === "production"
      ? new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        })
      : null,
    mode === "production" ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),

  // 关闭文件过大检查
  performance: {
    hints: false,
  },

  // 优化
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: "~",
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 10, // 需要级别高点
        },
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: "antd",
          chunks: "all",
          priority: 10, // 需要级别高点
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          priority: 9,
        },
        commons: {
          test: /src/,
          name: "commons",
          chunks: "all",
          priority: 9,
        },
      },
    },

    runtimeChunk: {
      name: "runtime",
    },

    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require("cssnano"), //引入cssnano配置压缩选项
        cssProcessorOptions: {
          discardComments: { removeAll: true },
        },
        canPrint: false,
      }),
    ],
  },
};