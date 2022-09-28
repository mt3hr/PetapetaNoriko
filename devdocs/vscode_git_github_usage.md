# vscode_git_github_usage

VSCodeからGitを使う方法、Githubと連携する方法の説明。

## 準備

1. Gitをインストールする
2. VSCodeをインストールする

多分以上でOK

## プロジェクトリポジトリのダウンロード

1. VSCodeを開き、Gitタブで「リポジトリのクローン」をクリックする
   ![リポジトリのクローン](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/master/resources/screenshot.1664349341.png)
   
2. URLには[https://github.com/mt3hr/PetapetaNoriko.git](https://github.com/mt3hr/PetapetaNoriko.git)(画像の場所からコピーできる）を入力する
   ![URL](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/screenshot.1664348953.png)
   フォルダ名はPetaPetaNorikoでいか
   ![ディレクトリの作成](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/screenshot.1664348995.png)
   ![ディレクトリの選択](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/screenshot.1664349013.png)

3. 「クローンしたリポジトリを開きますか」で「開く」をクリックする
   ![クローンしたリポジトリを開きますか](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources\screenshot.1664349023.png)

以上の操作でリポジトリのダウンロードが完了する

## プロジェクトリポジトリの開き方

1. VSCodeを開き、「フォルダーを開く」から「PetaPetaNoriko」フォルダを選択し開く。
![フォルダーを開く](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 140028.png)
![フォルダーの選択](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 140123.png)

2. こういうのでてきたら「信頼する」を選択する
![作成者を信頼します](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 140203.png)

以上の操作でVSCode上でプロジェクトリポジトリが開く。

## ソースコードのバージョン管理方法

この枝分かれしてるっぽいアイコンが、Gitを操作するためのタブです。
![ソース管理](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 141030.png)

### 初回作業（自分用の作業ブランチに移動する）

1. VSCodeでGitのタブを開く
2. 三点リーダーをクリックする。
3. 「チェックアウト先...」をクリックする。
![チェックアウト](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 141144.png)
4. 自分の名前っぽいブランチを選択する
![ブランチの選択](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 141727.png)

以上で自分用の作業ブランチへの移動が完了する
（別のパソコンでやる場合は再びこの操作をする必要がある）

### バージョンを保存してアップロードする

1. 普通にフォルダ作ったりファイル作ったりする。
   例えば「models/PetaPetaNorikoModel.asta」というファイルを新しく追加した場合で説明する
   ![ファイルの更新](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 141752.png)
2. まずは、更新があったファイルをステージングエリアに追加する。
   アップロードしたいファイルのみの「＋」を押す
   ![ステージングエリアへの追加](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 141839.png)
3. すると、「＋」を押したファイルが「ステージされている変更」に移動される
   ![ステージングエリア追加済み](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 141916.png)
4. 次に、コミットメッセージを記入して「☑」を押す。
   コミットメッセージはなるべく詳細に書いた方があとあといい。
   （複数行入力する場合、2行目はブランクにしないといけないルールがあるらしい）
   よくない例: 「アップデートしました」
   いい例: 「PetaPetaNorikoModel.asta（ブランク）を追加しました」
   ![コミットメッセージ入力](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 142029.png)
5. 「最後に変更の同期」を押す
   ![変更の同期](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 142201.png)
6. なんか出てきたらOKを押す
   ![アラート](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 142236.png)
7. なんかログインしろ言われたらブラウザでログインする
   ![ログイン](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 142345.png)

以上で更新のアップロードが完了する

### 他の人の更新をダウンロードする

1. 三点リーダーをクリックし、プルをクリックする
   ![プル](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/developmaster/resources/スクリーンショット 2022-09-28 142425.png)

以上で他の人の更新のダウンロードが完了する
