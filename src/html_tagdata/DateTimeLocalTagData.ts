import HTMLTagDataBase from "./HTMLTagDataBase";

export default class DateTimeLocalTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = "default"
    list = ""
    max = ""
    min = ""
    readonly = false
    required = false
    step = "60"
    constructor() {
        super()
        this.tagname = "datetime-local"
    }
}