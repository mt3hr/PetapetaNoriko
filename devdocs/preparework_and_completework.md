# preparework_and_completework

作業を始める前にやるべきこと、  
作業が完了した後にやるべきことの説明。  

## 作業を始める前にやるべきこと

1. VSCodeでCTRL+Pを押してターミナルを開く  
![ターミナルを開く](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/develop/devdocs/resources/screenshot.1664588794.png)    
2. 以下のコマンドを実行して自分の作業ブランチに移動する  
小路用  
```prepare_komichi.ps1:powershell
git checkout komichi;git pull --all;   
```
さいとうさん用  
```prepare_saitou.ps1:powershell
git checkout saitou;git pull --all;   
```
私用  
```prepare_sanekata.ps1:powershell
git checkout sanekata;git pull --all;   
```
![自分用作業ブランチに移動する](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/develop/devdocs/resources/screenshot.1664588858.png)    
3. 作業する（不要ならばCTRL+Pでターミナルを閉じて）  

## 作業後にやるべきこと

次に並べるすべての条件を満たす度、なるべく高頻度でこのコマンドを実行してください。  
（溜め込むとコミットメッセージを書くときに苦労することになります。レビューも大変になるので高頻度でコミットしてほしいです）  

### 変更保存条件
1. コンパイルが通り、実行できる  
2. 変更内容を日本語で説明できる（コミットメッセージを書ける）（なので、作業をするときにも並行せずに1つの目的に集中したほうがいいと思います）  

### 変更の保存とアップロード
1. VSCodeでCTRL+Pを押してターミナルを開く  
![ターミナルを開く](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/develop/devdocs/resources/screenshot.1664588794.png)    
2. 以下のコマンドを実行する（「～～を変更しました\n\n詳細詳細詳細」の部分は自分で変える必要あり）  
```complete.ps1:powershell
git add *; git commit "～～を更新しました\n\n詳細詳細詳細";git push;ush;
```
![変更を保存しアップロードする](https://raw.githubusercontent.com/mt3hr/PetapetaNoriko/develop/devdocs/resources/screenshot.1664589026.png)    
  