import HTMLTagDataBase from "./HTMLTagDataBase";

export default class LITagData extends HTMLTagDataBase {
    text = "リストアイテム"
    value = ""
    constructor() {
        super()
        this.tagname = "li"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}