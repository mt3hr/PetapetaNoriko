import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TableTagData extends HTMLTagDataBase {
    disabled = false
    label = "テーブル"
    selected = false
    value = "テーブル"
    constructor() {
        super()
        this.tagname = "table"
    }
}