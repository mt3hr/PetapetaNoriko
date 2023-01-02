import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class OLTagData extends HTMLTagDataBase {
    reversed = false
    start = ""
    constructor() {
        super()
        this.tagname = "ol"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return "ol"
    }
}