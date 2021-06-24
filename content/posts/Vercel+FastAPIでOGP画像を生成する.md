---
title: "Vercel+FastAPIでOGP画像を生成する"
date: 2021-06-25T00:40:59+09:00
draft: false
tags: ["Vercel", "FastAPI"]
slug: "ogp-image-with-vercel+fastapi"
---

## 背景

ツイッターでシェアしたときに出てくる OGP 画像を記事ごとに作成してリンクさせるのは面倒なので URL でテキストを指定したら OGP 画像がレスポンスされるような API サーバを作成しました。

## なぜ Vercel なのか

- データベースとかを使用しない簡単な処理だけの API サーバを構築するから
- [vercel/og-image](https://github.com/vercel/og-image)があり、そういう用途にむいていそう
- 無料でだいたいできるし、簡単にデプロイできる
- Heroku 以外のサービスを使ってみたかった

## なぜ FastAPI なのか

- Python の Web フレームワークを使ってみたかった
- API サーバーを書くのに向いてそう
- 簡単そう

## できたもの

[GitHub のリポジトリ](https://github.com/kinpoko/vercel-generating-og-images)

`https://vercel-generating-og-images.vercel.app/kinpoko.png?template=kinpokoblog`

![Demo](https://vercel-generating-og-images.vercel.app/kinpoko.png?template=kinpokoblog)

## 詰まったこと

- Vercel+FastAPI の情報があまりない

あまりネットになく、苦労しました。

- 画像生成方法

初めはテンプレートと URL で指定された文字列を組み合わせて png 形式で保存し、FastAPI の FileResponse でレスポンスしようかと思いましたが vercel 内でのファイル生成がわからず断念しました。編集した画像を bytes として保存し、それをそのままレスポンスの content にしました。結果的に処理がシンプルになった気がします。

## 感想

FastAPI は非常にシンプルだったので初めて API サーバーや Python の Web フレームワークに触れるのにはとても良かったと思います。実際始めてから 2、3 日で要件は満たせるようなものが完成しました。ドキュメントも自動で生成してくれるので非常に助かりました。またネタがあったら FastAPI で書いてみたいと思います。
