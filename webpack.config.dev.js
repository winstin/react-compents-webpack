/**
 * 本地启动配置文件
 */

const path = require("path"); //访问路径模块
const fs = require("fs"); //访问文件模块

/**
 * [HtmlWebpackPlugin description]
    1. 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题

    2. 可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const pkg = require("./package.json");

// const pkgDependencies = Object.keys(pkg.dependencies);

const appDirectory = fs.realpathSync(process.cwd());

console.log("===========================realpathSync Start======================")
console.log(process.cwd()) //获取当前项目路径
console.log(appDirectory)
console.log("===========================realpathSync End======================")

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

console.log("===========================resolveApp Start======================")
console.log(resolveApp("example/dist"))
console.log("===========================resolveApp End======================")

const LIB_NAMES = [];
const PATHS = {
  dist: resolveApp("dist"),
  appExampleDist: resolveApp("example/dist"),
  exampleIndexHtml: resolveApp("example/index.html"),
  exampleIndex: resolveApp("example/SideNav/index.js")
};

module.exports = {
  devtool: 'eval-source-map',
  entry: PATHS.exampleIndex,
  module: {
    rules: [{
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0",
          options: {
            presets: ["react", "es2015", "stage-0"],
            plugins: [
              [
                "import",
                {
                  libraryName: "antd",
                  style: "css"
                }
              ]
            ]
          }
        }]
      },
      {
        //antd样式处理
        test: /\.css$/,
        exclude: /src/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }

          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: PATHS.exampleIndexHtml
    })
  ],
  devServer: {
    port: 4000,
    open: true,
    quiet: true, //控制台中输出打包的信息
    noInfo: false,
    inline: true, //开启页面自动刷新
    lazy: false, //不启动懒加载
    progress: true //显示打包的进度
  }
};
