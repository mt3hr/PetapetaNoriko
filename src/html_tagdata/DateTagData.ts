import HTMLTagDataBase from "./HTMLTagDataBase";

export default class DateTagData extends HTMLTagDataBase {
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
        this.tagname = "date"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}