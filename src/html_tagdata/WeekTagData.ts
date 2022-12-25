import HTMLTagDataBase from "./HTMLTagDataBase";

export default class WeekTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = ""
    list = ""
    max = ""
    min = ""
    readonly = false
    required = false
    step = "1"
    constructor() {
        super()
        this.tagname = "week"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}