import HTMLTagDataBase from "./HTMLTagDataBase";

export default class URLTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    maxlength = ""
    autocomplete = "default"
    pattern = ""
    placeholder = ""
    readonly = ""
    required = false
    list = ""
    constructor() {
        super()
        this.tagname = "url"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}