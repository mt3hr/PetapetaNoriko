import HTMLTagDataBase from "./HTMLTagDataBase";

export default class RadioTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    required = false
    constructor() {
        super()
        this.tagname = "radio"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}