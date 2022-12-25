import HTMLTagDataBase from "./HTMLTagDataBase";

export default class PasswordTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    maxlength = ""
    autocomplete = ""
    pattern = ""
    placeholder = ""
    readonly = false
    required = false
    constructor() {
        super()
        this.tagname = "password"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}