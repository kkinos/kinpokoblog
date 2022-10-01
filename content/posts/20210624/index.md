---
title: "HugoでOGP設定"
date: 2021-06-24T00:03:28+09:00
draft: false
tags: ["Hugo"]
slug: setting-up-ogp-in-hugo
---

## 背景

Hugo のテーマをカスタマイズして OGP を設定しました。

## テーマのカスタマイズ方法

カスタマイズしたいテーマのファイルを layouts 以下ルートディレクトリにコピーします。例えば自分の場合は`themes/mini/layouts/partials/head.html`を変更したかったのでルートディレクトリに`layouts/partials/head.html`を作成し、内容をコピーしました。

## OGP 設定

こちらの記事を参考にしました。

[Hugo のブログサイトで OGP 設定をする](https://hugo-de-blog.com/hugo-ogp/)

`layouts/partials/head.html`

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aaaabbbbbbcc" />
<meta name="twitter:creator" content="@aaaabbbbbbcc" />
<meta property="og:title" content="{{ .Title }}" />
<meta property="og:url" content="{{ .Permalink }}" />
<meta property="og:image" content="hoge.png" />
<meta property="og:description" content="{{ .Description }}" />
```

## 参考

- [Hugo でテーマをカスタマイズする方法](https://ja.takp.me/posts/how-to-customize-the-hugo-themes/)
- [Hugo のブログサイトで OGP 設定をする](https://hugo-de-blog.com/hugo-ogp/)
