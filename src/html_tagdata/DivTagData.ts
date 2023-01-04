import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class DivTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "div"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<div>\n"
        for (let i = 0; i < this.child_tagdatas.length; i ++) {
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</div>\n"
        return html
    }
    override to_string(): string {
        return "div"
    }
}