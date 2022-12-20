import HTMLTagDataBase from "./HTMLTagDataBase";

export default class MonthTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = "default"
    list = ""
    max = ""
    min = ""
    readonly = false
    required = false
    step = "1"
    constructor() {
        super()
        this.tagname = "month"
    }
}