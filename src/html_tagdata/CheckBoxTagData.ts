import HTMLTagDataBase from "./HTMLTagDataBase";

export default class CheckBoxTagData extends HTMLTagDataBase {
    name = ""
    value = false
    checked = false
    constructor() {
        super()
        this.tagname = "checkbox"
    }
}