import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TDData extends HTMLTagDataBase {
    colspan = ""
    rowspan = ""
    headers = ""
    constructor() {
        super()
        this.tagname = "td"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return "td"
    }
}