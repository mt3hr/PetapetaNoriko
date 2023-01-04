import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class OptionTagData extends HTMLTagDataBase {
    disabled = false
    label = "オプション"
    selected = false
    value = "オプション"
    constructor() {
        super()
        this.tagname = "option"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<option"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.disabled) html += " disabled"
        if (this.label != "") html += " label=\"" + this.label + "\""
        if (this.selected) html += " selected"
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">\n"
        html += indent
        html += "</option>\n"
        return html
    }
    override to_string(): string {
        return this.label
    }
}