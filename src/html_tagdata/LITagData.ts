import HTMLTagDataBase from "./HTMLTagDataBase";

export default class LITagData extends HTMLTagDataBase {
    text = "リストアイテム"
    value = ""
    constructor() {
        super()
        this.tagname = "li"
    }
}