const path = require('path');
require("postcss-loader")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const port =  4294;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDev = process.env.DEVMODE == 1 ? true : false;

// is bad???
module.exports = {


devtool: isDev ? 'inline-source-map' : 'hidden-source-map',

  entry: './fr/scripts/index.js',
  mode: isDev ? "development" : "production",
  plugins: [
    new HtmlWebpackPlugin({
      title: 'AZSDB',
      
    }),
  ],
  output: {
    filename: '[contenthash].js',
    path: path.resolve(__dirname, 'fr/_lc/js'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Add .jsx to resolve extensions
  },
  optimization: {
   moduleIds: 'deterministic',
     runtimeChunk: 'single',

    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                [
                  "postcss-preset-env",
                  {
                    // Options
                  },
                ],
              ],
            },
          }
        }
      ],
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-react']
            }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
     {
       test: /\.(csv|tsv)$/i,
       use: ['csv-loader'],
     },
     {
       test: /\.xml$/i,
       use: ['xml-loader'],
     },

           {
               test: /\.(js|jsx)$/,
               exclude: /node_modules/,
               loader: "babel-loader"
           }
    ],
  }, plugins: [
    new HtmlWebpackPlugin({
      template: "fr/templates/temp.index.html",
      filename: "../../pages/index.html",
      publicPath: "/",
    }),
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    open: true
  },
  ignoreWarnings: [
    // Ignore warnings with specific messages
    {
      message: /module has no exports/,
    }
  ],
};