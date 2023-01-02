import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class TDData extends HTMLTagDataBase {
    colspan = ""
    rowspan = ""
    headers = ""
    constructor() {
        super()
        this.tagname = "td"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return "td"
    }
}