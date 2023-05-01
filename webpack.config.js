const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: '../manifest.json' },
        { from: './public/background.js', to: '../background.js' },
        { from: './public/content.js', to: '../content.js' },
        { from: './public/injected.js', to: '../injected.js' },
        { from: './public/wt-gray.png', to: '../wt-gray.png' },
        { from: './public/wt-yellow.png', to: '../wt-yellow.png' },
        { from: './public/wt-green.png', to: '../wt-green.png' },
      ],
    }),
    ...getHtmlPlugins(['index']),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: 'Wordle Timer',
        filename: `${chunk}.html`,
        chunks: [chunk],
      }),
  );
}
