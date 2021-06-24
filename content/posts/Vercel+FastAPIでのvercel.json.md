---
title: "Vercel+FastAPIでのvercel.json"
date: 2021-06-23T18:38:11+09:00
draft: false
tags: ["Vercel", "FastAPI", "Python"]
slug: vercel.json-with-vercel+fastapi
---

## 背景

Vercel と FastAPI で簡単な API サーバを構築しようと思ったのですが、Vercel の設定で少しつまづいてしまったのでメモ代わりに残しておきます。

## RootDirectory の構成

```
rootdir/
    ├ api/
    |    └ main.py
    ├ requirements.txt
    └ vercel.json
```

api ディレクトリにメインのコードを置き、ルートディレクトリ直下に vercel.json と requirements.txt を置きます。

## main.py

```python
from typing import Optional

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
```

## vercel.json

```json
{
  "functions": {
    "api/main.py": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [{ "source": "/(.*)", "destination": "api/main.py" }]
}
```

URL とファイルへのパスのマッピングを rewrites で行います。上記の様にすると`/items/1?q=hoge`と`/docs`が使えるようになります。

## requirements.txt

```txt
uvicorn
fastapi
```

## さいごに

自分は vercel.json でつまりました。Vercel と FastAPI の情報があまりなく、あっても今は非推奨だったりでよくわかりませんでした。もっとこうしたほうがいい等あったらぜひ教えていただきたいです。
