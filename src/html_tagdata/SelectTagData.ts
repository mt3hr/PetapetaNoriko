import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class SelectTagData extends HTMLTagDataBase {
    autofocus = false
    disabled = false
    multiple = false
    name = "セレクトボックス"
    size = ""
    constructor() {
        super()
        this.tagname = "select"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<select"
        if (this.autofocus) html += " autofocus"
        if (this.disabled) html += " disabled"
        if (this.multiple) html += " multiple"
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.size != "") html += " size=\"" + this.size + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options) + "\n"
        }
        html += "</select>\n"
        return html
    }
    override to_string(): string {
        return this.name
    }
}