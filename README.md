# [PutPullMock](http://jec21jy0216.pya.jp/)
PutPullMockはワイヤーフレーム作成支援アプリケーションです。  
![ppmk](https://raw.githubusercontent.com/mt3hr/PutPullMock/main/devdocs/resources/screenshot.1677014929.png)

## インストール、ビルドなど

### インストール
[ここ](https://github.com/mt3hr/PutPullMock/releases/)からppmk.exeをダウンロード  
もしくはppmk_server.exeをダウンロード  
もしくは自分でビルド（手順は下の方に記載）  

### 起動

#### ppmk
初回実行時は起動までに時間がかかります  
```powershell:launch_ppmk.ps1
ppmk
```

#### ppmk_server
```powershell:launch_ppmk_server.ps1
ppmk_server
```

#### 起動フラグ、起動引数
- --port: 使用するポートを指定できます
- --proxy: 使用するproxyを指定できます
- --login_system: ログイン機能を有効化します。サーバにデータを保存したりできるようになります。
- --dbfilename: ログイン機能で使用するデータベースファイル名を指定できます
- --register: ログイン機能でアカウント新規登録画面を有効化します

#### 環境変数
- PPMK_EMAIL_HOSTNAME: ログイン機能で使用する、パスワードリセット用メールのホスト名  
- PPMK_EMAIL_PORT: ログイン機能で使用する、パスワードリセット用メールのポート番号         
- PPMK_EMAIL_USERNAME: ログイン機能で使用する、パスワードリセット用メールのユーザ名  
- PPMK_EMAIL_PASSWORD: ログイン機能で使用する、パスワードリセット用メールのパスワード     
すべて設定してから起動するとパスワードリセットメール送信機能が有効になります。  
まだ実装してないですけど。
//TODO

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

### インストール
```powershell:build_ppmk.ps1
cd $HOME/PutPullMock
npm run install_app
npm run install_server
```
</details>
