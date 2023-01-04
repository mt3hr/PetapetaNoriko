import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class TDData extends HTMLTagDataBase {
    colspan = ""
    rowspan = ""
    headers = ""
    constructor() {
        super()
        this.tagname = "td"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<td"
        if (this.colspan != "") html += " colspan=\"" + this.colspan + "\""
        if (this.rowspan != "") html += " rowspan=\"" + this.rowspan + "\""
        if (this.headers != "") html += " headers=\"" + this.headers + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</td>\n"
        return html
    }
    override to_string(): string {
        return "td"
    }
}