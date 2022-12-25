import HTMLTagDataBase from "./HTMLTagDataBase";

export default class FormTagData extends HTMLTagDataBase {
    acceptcharset = ""
    action = ""
    autocomplete = ""
    enctype = ""
    method = ""
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