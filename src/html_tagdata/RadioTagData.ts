import HTMLTagDataBase from "./HTMLTagDataBase";

export default class RadioTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    required = false
    constructor() {
        super()
        this.tagname = "radio"
    }
}