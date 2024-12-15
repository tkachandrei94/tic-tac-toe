import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // Точка входа для сборки
  entry: './src/index.js',

  // Настройка выхода бандла
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  // Настройка загрузчиков
  module: {
    rules: [
      {
        test: /\.js$/, // Обработка JavaScript-файлов
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Обработка CSS-файлов
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // Плагины
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Шаблон HTML-файла
    }),
  ],

  // Локальный сервер разработки
  devServer: {
    static: './dist',
    port: 3000,
    open: true, // Автоматически открывать браузер
    hot: true, // Отключаем Hot Module Replacement
    liveReload: true, // отключение liveReload
  },

  devtool: false, // отключаем source maps (или укажите 'inline-source-map' для отладки)

  mode: 'development', // Режим разработки (development или production)
};
