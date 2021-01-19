const path = require("path");

module.exports = {
  entry: "./app/Main.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "app"),
    filename: "bundled.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "app"),
    hot: true,
    historyApiFallback: { index: "index.html" },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
          loader: "css-loader",
          options: {
            modules: true
           }
        }]
      },
      {
        test: /\.pdf(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?minetype=application/pdf&name=[name].pdf'
      }
    ],
  },
};
