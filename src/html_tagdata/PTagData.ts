import HTMLTagDataBase from "./HTMLTagDataBase";

export default class PTagData extends HTMLTagDataBase {
    text = "段落"
    constructor() {
        super()
        this.tagname = "p"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}