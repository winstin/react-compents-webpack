/**
 * 打包生产配置文件
 * @type {[type]}
 */
const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob');
const pkg = require("./package.json");

const pkgDependencies = Object.keys(pkg.dependencies);
console.log("externals111:", pkgDependencies);
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const LIB_NAMES = [];
const PATHS = {
  dist: resolveApp('dist'),
  package: resolveApp('package.json')
};

console.log("path.join(__dirname, 'package.json'):", path.join(__dirname, 'package.json'))
console.log("PATHS.package:", PATHS.package)

//get file folder

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath); //遍历 globPath 路径下的所有文件

  console.log("files:", files)
  /*[ 'src/Dropdown/DropOption.js',
  'src/Dropdown/DropOptionButton.js',
  'src/Dropdown/index.js',
  'src/Dropdown/myfile/index.js',
  'src/index.js',
  'src/SideNav/SideNav.js' ]*/

  var entries = {},
    entry, dirname, basename, pathname, extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    pathname = pathDir ? pathname.replace(pathDir, '') : pathname;
    //console.log(2, pathname, entry);
    entries[pathname] = resolveApp(path.join(dirname, basename));
  }
  return entries;
}
const myEntries = getEntry('src/**/*.js', 'src\\');

console.log("myEntries:", myEntries);
/*{ 'Dropdown\\DropOption': 'D:\\新建文件夹\\react-compents\\src\\Dropdown\\DropOption',
  'Dropdown\\DropOptionButton': 'D:\\新建文件夹\\react-compents\\src\\Dropdown\\DropOptionButton',
  'Dropdown\\index': 'D:\\新建文件夹\\react-compents\\src\\Dropdown\\index',
  'Dropdown\\myfile\\index': 'D:\\新建文件夹\\react-compents\\src\\Dropdown\\myfile\\index',
  index: 'D:\\新建文件夹\\react-compents\\src\\index',
  'SideNav\\SideNav': 'D:\\新建文件夹\\react-compents\\src\\SideNav\\SideNav' }
  */

module.exports = {
  entry: myEntries, //入口起点
  externals: pkgDependencies,
  output: { //出口
    path: PATHS.dist,
    filename: "[name].js",
    libraryTarget: "umd"
  },
  module: { //loader加载器，loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
    rules: [
      // {
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: "babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0",
      //       options: { presets: ["react", "es2015","stage-0"] }
      //     }
      //   ]
      // }
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/, //test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
        exclude: /node_modules/,
        use: [{ //use 属性，表示进行转换时，应该使用哪个 loader。
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
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         chunks: "initial",
  //         minChunks: 2,
  //         maxInitialRequests: 5, // The default limit is too small to showcase the effect
  //         minSize: 0 // This is example is too small to create commons chunks
  //       },
  //       vendor: {
  //         test: /node_modules/,
  //         chunks: "initial",
  //         name: "vendor",
  //         priority: 10,
  //         enforce: true
  //       }
  //     }
  //   }
  // },
  plugins: [
    new CleanWebpackPlugin(['dist']), //清理dist文件夹
    //   new HtmlWebpackPlugin({
    //     template: path.join(__dirname, "src", "index.html")
    //   }),
    new CopyWebpackPlugin([{
      from: PATHS.package,
      to: PATHS.dist,
      transform: function(content) {
        var data = JSON.parse(content.toString());
        var result = {
          name: data.name,
          version: data.version,
          main: data.main,
          author: data.author,
          license: data.license,
          peerDependencies: data.peerDependencies
        };
        return new Buffer(JSON.stringify(result));
      }
    }])
  ]
};
