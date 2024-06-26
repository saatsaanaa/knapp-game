const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPartialsPlugin = require("html-webpack-partials-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.jsx",
    lobby: "./src/lobby.jsx",
    cardDecks: "./src/card-decks.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "docs"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        resourceQuery: /raw/,
        type: "asset/source",
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/i,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),

    // Landing lobby
    new HtmlWebpackPlugin({
      hash: true,
      scriptLoading: "blocking",
      template: "./src/index.html",
      filename: "./index.html",
      chunks: ["index"],
    }),

    // Колоды карт
    new HtmlWebpackPlugin({
      hash: true,
      scriptLoading: "blocking",
      template: "./src/pages/card-decks.html",
      filename: "./pages/card-decks.html",
      chunks: ["cardDecks"],
    }),

    // Internal pages
    new HtmlWebpackPlugin({
      hash: true,
      scriptLoading: "blocking",
      template: "./src/pages/lobby.html",
      filename: "./pages/lobby.html",
      chunks: ["lobby"],
    }),

    // Partials
    new HtmlWebpackPartialsPlugin([
      {
        path: path.join(__dirname, "./src/partials/header.html"),
        location: "header",
        template_filename: "*",
        priority: "replace",
      },
    ]),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
