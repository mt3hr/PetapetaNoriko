import HTMLTagDataBase from "./HTMLTagDataBase";

export default class LabelTagData extends HTMLTagDataBase {
    form = ""
    for = ""
    constructor() {
        super()
        this.tagname = "label"
    }
}