import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ColorTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = "default"
    constructor() {
        super()
        this.tagname = "color"
    }
}