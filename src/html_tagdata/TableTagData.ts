import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class TableTagData extends HTMLTagDataBase {
    disabled = false
    label = ""
    selected = false
    value = ""
    constructor() {
        super()
        this.tagname = "table"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<table"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.disabled) html += " disabled"
        if (this.label != "") html += " label=\"" + this.label + "\""
        if (this.selected) html += " selected"
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</table>"
        return html
    }
    override to_string(): string {
        return "table"
    }
}