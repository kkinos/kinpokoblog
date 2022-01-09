---
title: "Hugoで外部サイトのOGPを取得する"
date: 2022-01-09T16:43:52+09:00
draft: false
tags: ["Hugo", "Vercel", "Go"]
slug: "get-ogp-of-external-site"
---

# はじめに

ブログで GitHub のリポジトリを紹介するときに、リンクだけでは味気ないのでリポジトリの URL から OGP を取得するような shortcode を作成しました。

# 方法

初めに考えたのは Hugo の shortcode で JavaScript を埋め込み、そのスクリプトの中で JavaScript の fetch を用いて対象の URL にアクセスし、そのレスポンスから OGP 情報を取得するという方法でした。しかし、これは[同一オリジンポリシー](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)に違反してしましました。これは簡単に言うと、ブラウザはリクエストしたオリジン(ドメインのようなもの)以外にリクエストを投げることを制限しているということです。つまり前述の方法では、ブラウザはこのブログであるhttps://kinpokoblog.com にリクエストしたのにスクリプトが別のオリジンにリクエストを投げたので、それを制限しようとしてしまいます。(厳密には少し違う)

では異なるオリジンにリクエストを送り、そのレスポンスを受け取ろうとするにはどうするのかというと[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)を使用します。これはリクエストされるサーバで設定すればいいです。

よって最終的には、別のサイトの URL を受け取って OGP の情報を返すような API サーバを自分で立てて、そのサーバで CORS の設定を行い、shortcode はそのサーバに対してリクエストを送るようなスクリプトを埋め込むという方法にしました。以下は実装です。

# API サーバ

Go と Vercel を使いました。

{{<githubcard url="https://github.com/kinpoko/getogp" name="getogp">}}

Vercel で CORS の設定をするには以下のようにします。[参考](https://kotsukotsu.work/tech/2020-09-13-vercel-ウェブサイトのogp情報を取得する-serverless-functions-を作成する/)

`vercel.json`

```json
{
  "routes": [
    {
      "src": "/api/*",
      "methods": ["GET"],
      "dest": "/api/*",
      "headers": {
        "Access-Control-Allow-Origin": "https://kinpokoblog.com"
      }
    }
  ]
}
```

# shortcode

`layout/shortcodes/githubcard.html`

```html
<script type="text/javascript">
  var Url = "{{ .Get "url"}}"
  var Name = "{{ .Get "name"}}"
</script>

<div class="githubcard" id="{{ .Get "name"}}" align= "center"></div>
<br />


{{ with resources.Get "js/githubcard.js" }} {{ $js := resources.Get . |
js.Build}}

<script src="{{ $js.Permalink }}"></script>
{{ end }}
```

# スクリプト

`assets/js/githubcard.js`

```js
MakeGithubCard(Url, Name);

function MakeGithubCard(url, name) {
  var repo_name = name;
  fetch("https://getogp.vercel.app/api?url=" + url, {
    mode: "cors",
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      MakeCard(result, repo_name);
    })
    .catch((e) => {
      console.log(e);
    });
}

function MakeCard(jsonObj, name) {
  const target_ele = document.getElementById(name);
  const title = jsonObj.title;
  const url = jsonObj.url;
  const description = jsonObj.description;
  const image_url = jsonObj.image;

  var ele_a = document.createElement("a");
  ele_a.href = url;

  var ele_img = document.createElement("img");
  ele_img.src = image_url;
  ele_img.style.width = "70%";
  ele_img.style.height = "70%";

  ele_a.appendChild(ele_img);
  target_ele.appendChild(ele_a);
}
```

# おわりに

外部の OGP を取得する API サーバを Go と Vercel で構築し、Hugo の shortcode を用いて API サーバとやり取りをするような JavaScript を埋め込みました。参考になれば幸いです。
