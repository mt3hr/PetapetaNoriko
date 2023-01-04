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
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<td"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.colspan != "") html += " colspan=\"" + this.colspan + "\""
        if (this.rowspan != "") html += " rowspan=\"" + this.rowspan + "\""
        if (this.headers != "") html += " headers=\"" + this.headers + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</td>"
        return html
    }
    override to_string(): string {
        return "td"
    }
}