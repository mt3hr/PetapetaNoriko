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
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}