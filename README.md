# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment.

# svelte-post-app-sample

## Tool version

- Node.js
  - 16.13

## setup

```
npm i
```

## デバッグデプロイ

```
npm run dev
```

# Svelte 関連

## Svelte とは

- SPA のフロントエンドフレームワーク
- html, js, css にコンパイルされる

## SvelteKit とは

- Web アプリフレームワーク
- フォルダ・ファイル名でのルーティング
  - routes 配下の構成がルーティングに反映
- react でいう Next、Vue でいう Nuxt のようなもの
- SSR 実現できる

## Sveltekit なしだとどうなるか

- rollup でコンパイル
- コンパイルされた js, css が public/build に配置される
- 起点ファイルの public/index.html が/build/bundle.js を読み込む
  - react/vue と同様で、index.html から js が読み込まれそこからは JS 処理が全てになる

# Svelte setup

## setup project

```
npm init svelte@next
```

## Svelte-material-ui セットアップ

https://github.com/hperrin/svelte-material-ui/blob/master/SVELTEKIT.md

### Theme build

```
npm install --save-dev smui-theme
npx smui-theme template src/theme
```

### add npm scripts

```
"prepare": "npm run smui-theme",
"smui-theme": "smui-theme compile static/smui.css -i src/theme"
```

### Modify app.html head tag

```
<!-- Material Icons -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<!-- Roboto -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<!-- Roboto Mono -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>
<!-- SMUI Styles -->
<link rel="stylesheet" href="/smui.css" />
```
