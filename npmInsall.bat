SET NODEJS_HOME=C:%HOMEPATH%\node-v18.10.0-win-x64
SET PATH=%NODEJS_HOME%;%PATH%
npm -g config set proxy http://proxy00.jec.ac.jp:8080
npm -g config set https-proxy http://proxy00.jec.ac.jp:8080
npm -g config set registry http://registry.npmjs.org/
npm i