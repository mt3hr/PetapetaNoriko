import HTMLTagDataBase from "./HTMLTagDataBase";

export default class OptionTagData extends HTMLTagDataBase {
    disabled = false
    label = "オプション"
    selected = false
    value = "オプション"
    constructor() {
        super()
        this.tagname = "option"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}