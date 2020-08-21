const path = require("path");
// 抽取css代码
const MiniCssRxtractPlugin = require("mini-css-extract-plugin");
// 选取最后一个值
const mode = process.argv.slice(-1)[0];
const isPro = mode === "production";
// cssloader对象
const cssLoder = {
  production: {
    loader: MiniCssRxtractPlugin.loader,
  },
  development: {
    loader: "style-loader",
  },
};

// tsx解析器
const tsxLoader = {
  test: /\.tsx?$/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/env", "@babel/react", "@babel/preset-typescript"],
        plugins: [
          [
            "import",
            { libraryName: "antd", libraryDirectory: "es", style: true },
          ],
        ],
      },
    },
  ],
};

// 缓存解析器
const sourceLoader = {
  enforce: "pre",
  test: /\.js$/,
  loader: "source-map-loader",
};

// css 解析器
const cssLoader = {
  test: /\.css$/,
  use: [
    cssLoder[mode],
    {
      loader: "css-loader",
    },
  ],
};
const lessLoader = {
  test: /\.less$/,
  use: [
    cssLoder[mode],
    {
      loader: "css-loader",
    },
    {
      loader: "less-loader",
      options: {
        lessOptions: {
          modifyVars: require(path.resolve(__dirname, "modifyVars.js")),
          javascriptEnabled: true,
        },
      },
    },
  ],
};

module.exports = {
  mode,
  isPro,
  tsxLoader,
  sourceLoader,
  cssLoader,
  lessLoader,
};