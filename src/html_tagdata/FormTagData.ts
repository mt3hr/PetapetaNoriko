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
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<tr"
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
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</tr>\n"
        return html
    }
    override to_string(): string {
        return this.name
    }
}