import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class OLTagData extends HTMLTagDataBase {
    reversed = false
    start = ""
    constructor() {
        super()
        this.tagname = "ol"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<ol>\n"
        for (let i = 0; i < this.child_tagdatas.length; i ++) {
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</ol>\n"
        return html
    }
    override to_string(): string {
        return "ol"
    }
}