import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class SelectTagData extends HTMLTagDataBase {
    autofocus = false
    disabled = false
    multiple = false
    name = ""
    size = ""
    constructor() {
        super()
        this.tagname = "select"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<select"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.autofocus) html += " autofocus"
        if (this.disabled) html += " disabled"
        if (this.multiple) html += " multiple"
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.size != "") html += " size=\"" + this.size + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</select>"
        return html
    }
    override to_string(): string {
        return this.name
    }
}