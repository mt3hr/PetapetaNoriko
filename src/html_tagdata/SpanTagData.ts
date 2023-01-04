import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class SpanTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "span"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<span>\n"
        for (let i = 0; i < this.child_tagdatas.length; i ++) {
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</span>\n"
        return html
    }
    override to_string(): string {
        return "span"
    }
}