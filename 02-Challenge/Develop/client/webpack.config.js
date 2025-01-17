const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development', // Use 'development' for easier debugging; switch to 'production' for deployment

    // Entry points for different JavaScript files
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },

    // Output configuration for bundled files
    output: {
      filename: '[name].bundle.js', // Generates bundles with entry point names
      path: path.resolve(__dirname, 'dist'), // Output directory
      clean: true, // Automatically cleans the dist folder before each build
    },

    plugins: [
      // Generates an HTML file and injects the bundled scripts
      new HtmlWebpackPlugin({
        template: './index.html', // Template file for the HTML
        title: 'PWA Text Editor', // Title of the HTML file
      }),

      // Configures a custom service worker using Workbox
      new InjectManifest({
        swSrc: './src-sw.js', // Path to the custom service worker
        swDest: 'src-sw.js', // Destination filename in the dist folder
      }),

      // Generates a manifest.json file for PWA configuration
      new WebpackPwaManifest({
        fingerprints: false, // Avoids appending hash to filenames
        inject: true, // Automatically links the manifest in the HTML
        name: 'Text Editor',
        short_name: 'TextEditor',
        description: 'A simple PWA text editor',
        background_color: '#ffffff',
        theme_color: '#31a9e1',
        start_url: './', // Entry point for the PWA
        publicPath: './', // Base path for resources
        icons: [
          {
            src: path.resolve('src/images/logo.png'), // Path to the app icon
            sizes: [96, 128, 192, 256, 384, 512], // Icon sizes
            destination: path.join('assets', 'icons'), // Destination folder for icons
          },
        ],
      }),
    ],

    module: {
      rules: [
        // CSS loaders to process and inject CSS
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'], // Processes CSS files and injects them into the DOM
        },

        // Babel loader to transpile modern JavaScript
        {
          test: /\.m?js$/, // Matches .js and .mjs files
          exclude: /node_modules/, // Excludes node_modules from processing
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // Transpiles modern JavaScript to ES5
              plugins: [
                '@babel/plugin-proposal-object-rest-spread', // Supports object spread/rest syntax
                '@babel/transform-runtime', // Optimizes reusability of Babel helpers
              ],
            },
          },
        },
      ],
    },
  };
};