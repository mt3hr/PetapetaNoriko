import HTMLTagDataBase from "./HTMLTagDataBase";

export default class LabelTagData extends HTMLTagDataBase {
    form = ""
    for = ""
    constructor() {
        super()
        this.tagname = "label"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}