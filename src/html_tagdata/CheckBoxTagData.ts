import HTMLTagDataBase from "./HTMLTagDataBase";

export default class CheckBoxTagData extends HTMLTagDataBase {
    name = ""
    value = false
    checked = false
    constructor() {
        super()
        this.tagname = "checkbox"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}