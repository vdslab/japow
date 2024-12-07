# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# grib データの取得方法

1. docker-python ディレクトリに入る  
   `cd docker-python`

2. snow.py 内のの読み込み・書き込みファイルを設定

3. ターミナルで docker コンテナを起動  
   `docker-compose run --rm eccodes`

# 線形補間

src/functions に入って node LinearInt.js
