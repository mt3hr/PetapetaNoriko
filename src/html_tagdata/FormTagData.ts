import HTMLTagDataBase from "./HTMLTagDataBase";

export default class FormTagData extends HTMLTagDataBase {
    acceptcharset = ""
    action = ""
    autocomplete = "on"
    enctype = "application/x-www-form-urlencoded"
    method = "get"
    name = ""
    novalidate = true
    target = ""
    constructor() {
        super()
        this.tagname = "form"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}