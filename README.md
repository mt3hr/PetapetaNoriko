# [PutPullMock](http://jec21jy0216.pya.jp/)
PutPullMockはワイヤーフレーム作成支援アプリケーションです。  
![ppmk](https://raw.githubusercontent.com/mt3hr/PutPullMock/main/devdocs/resources/screenshot.1672967496.png)

## インストール、ビルドなど

### インストール
[ここ](https://github.com/mt3hr/PutPullMock/releases/)からppmk.exeをダウンロード  
もしくは自分でビルド（手順は下の方に記載）  

### 起動
初回実行時は起動までに時間がかかります  
```powershell:launch_ppmk.ps1
ppmk
```

<details>
<summary>開発者向け</summary>
（powershellで実行してください）

### セットアップ
1. [nodejs-v18.12.1](https://nodejs.org/download/release/v18.12.1/node-v18.12.1-x64.msi)をインストールする
2. [golang-v1.19.4](https://go.dev/dl/go1.19.4.windows-amd64.msi)をインストールする
3. このRepositoryをCloneする
```powershell:clone_ppmk
cd $HOME
git clone https://github.com/mt3hr/PutPullMock.git
cd PutPullMock
```
4. セットアップする
```posershell:setup.ps1
npm i
```

### 開発
以下のコマンドを実行してから表示されたアドレスにアクセスし、ソースコードを編集する  
```powershell:serve_ppmk.ps1
cd $HOME/PutPullMock
code .
npm run serve
```

### ビルド
```powershell:build_ppmk.ps1
cd $HOME/PutPullMock
npm run build
cd src/app/
go build -ldflags="-H windowsgui"
```
</details>