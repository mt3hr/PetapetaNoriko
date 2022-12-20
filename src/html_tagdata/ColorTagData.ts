import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ColorTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = "default"
    constructor() {
        super()
        this.tagname = "color"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}