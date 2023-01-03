# PutPullMock
PutPullMockはワイヤーフレーム作成支援アプリケーションです。

## ビルド、インストールなど

### セットアップ
```
npm i
```

### インストール
Go言語開発環境が必要
```
npm run build; cd src/app/; go install -ldflags="-H windowsgui";
```

### 起動
初回実行時は起動までに時間がかかります
```
ppmk
```