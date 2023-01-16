import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class LITagData extends HTMLTagDataBase {
    text = ""
    value = ""
    constructor() {
        super()
        this.tagname = "li"
        this.has_child_tag = true
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<li"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">"
        html += this.text + "</li>"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        return html
    }
    override to_string(): string {
        return this.text
    }
}