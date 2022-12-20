import HTMLTagDataBase from "./HTMLTagDataBase";

export default class SelectTagData extends HTMLTagDataBase {
    autofocus = false
    disabled = false
    multiple = false
    name = "セレクトボックス"
    size = ""
    constructor() {
        super()
        this.tagname = "select"
    }
}