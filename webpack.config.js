const path = require('path');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: "development",
  
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: "./src/index.ts",

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    },

    devtool: 'source-map',
  
    module: {
      rules: [
        {
          // 拡張子 .ts の場合
          test: /\.ts$/,
          // TypeScript をコンパイルする
          use: "ts-loader"
        }
      ]
    },

    resolve: {
      extensions: [".ts"],
      alias: {
        vue: "vue/dist/vue.js"
      }
    }
  };