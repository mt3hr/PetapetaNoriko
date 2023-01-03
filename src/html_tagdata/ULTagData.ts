import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class ULTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "ul"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<ul>\n"
        for (let i = 0; i < this.child_tagdatas.length; i ++) {
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</ul>\n"
        return html
    }
    override to_string(): string {
        return "ul"
    }
}