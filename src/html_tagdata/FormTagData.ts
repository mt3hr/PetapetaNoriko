import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class FormTagData extends HTMLTagDataBase {
    acceptcharset = ""
    action = ""
    autocomplete = ""
    enctype = ""
    method = ""
    name = ""
    novalidate = true
    target = ""
    constructor() {
        super()
        this.tagname = "form"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<tr"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.acceptcharset != "") html += " acceptcharset=\"" + this.acceptcharset + "\""
        if (this.action != "") html += " action=\"" + this.action + "\""
        if (this.autocomplete != "") html += " autocomplete=\"" + this.autocomplete + "\""
        if (this.enctype != "") html += " enctype=\"" + this.enctype + "\""
        if (this.method != "") html += " method=\"" + this.method + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.novalidate) html += " novalidate"
        if (this.target != "") html += " =\"" + this.target + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</tr>"
        return html
    }
    override to_string(): string {
        return this.name
    }
}