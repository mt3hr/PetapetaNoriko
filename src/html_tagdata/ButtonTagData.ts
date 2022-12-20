import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ButtonTagData extends HTMLTagDataBase {
    name = ""
    value = "ボタン"
    constructor() {
        super()
        this.tagname = "button"
    }
}