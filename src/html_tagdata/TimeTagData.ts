import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TimeTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = "default"
    list = ""
    max = ""
    min = ""
    required = false
    step = "60"
    constructor() {
        super()
        this.tagname = "time"
    }
}