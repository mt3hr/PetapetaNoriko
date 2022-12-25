import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TimeTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = ""
    list = ""
    max = ""
    min = ""
    required = false
    step = ""
    constructor() {
        super()
        this.tagname = "time"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}