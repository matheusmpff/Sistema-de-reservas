import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import autoprefixer from "autoprefixer";

// In Node.js versions prior to native support for import.meta.dirname,
// derive __dirname from import.meta.url.
// (Node 20.11+ supports import.meta.dirname and import.meta.filename.)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: {
    quartos: "./src/js/quartos.js",
    login: "./src/js/login.js",
    cadastro: "./src/js/cadastro.js",
    feedback: "./src/js/feedback.js",
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "quartos.bundle.html",
      template: "./src/quartos.html",
      chunks: ["quartos"],
    }),
    new HtmlWebpackPlugin({
      filename: "login.bundle.html",
      template: "./src/login.html",
      chunks: ["login"],
    }),
    new HtmlWebpackPlugin({
      filename: "cadastro.bundle.html",
      template: "./src/cadastro.html",
      chunks: ["cadastro"],
    }),
    new HtmlWebpackPlugin({
      filename: "feedback.bundle.html",
      template: "./src/feedback.html",
      chunks: ["feedback"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { 
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                silenceDeprecations: [
                  'mixed-decls',
                  'color-functions',
                  'global-builtin',
                  'import'
                ],
              },
             },
          },
        ],
      },
    ],
  },
};
