// https://qiita.com/tkrkt/items/a806d6c80d69b52af1b8
const constructors = {}; // コンストラクタ格納

// class用decorator (toJSONを生やす)
export const serializable = (target: any) => {
    constructors[target.name] = target;
    target.prototype.toJSON = function (key) {
        if (key === '__serializeValue') { // 入れ子ループ防止用
            return (this)
        } else {
            // デシリアライズに必要な情報を埋める
            return {
                __serializeName: target.name,
                __serializeValue: (this)
            };
        }
    };
};

// JSON.parse用関数
export const deserialize = (k: string, v: any) => {
    // 関係ないオブジェクトは通常処理
    if (!v.__serializeName) return v;

    if (constructors[v.__serializeName].fromJSON) {
        // fromJSONが定義されていればそれを利用
        return constructors[v.__serializeName].fromJSON((v.__serializeValue))
    } else {
        // 定義されていなければ無引数でコンストラクタ実行して値設定
        const obj = new constructors[v.__serializeName]();
        for (const key in v.__serializeValue) {
            // if (Object.prototype.hasOwnProperty.call(v, key))
            obj[key] = (v.__serializeValue[key])
        }
        return obj;
    }
};