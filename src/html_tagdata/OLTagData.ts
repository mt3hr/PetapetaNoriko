import HTMLTagDataBase from "./HTMLTagDataBase";

export default class OLTagData extends HTMLTagDataBase {
    reversed = false
    start = ""
    constructor() {
        super()
        this.tagname = "ol"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return "ol"
    }
}