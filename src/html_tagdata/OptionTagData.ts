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
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<option"
        if (this.disabled) html += " disabled"
        if (this.label != "") html += " label=\"" + this.label + "\""
        if (this.selected) html += " selected"
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">\n"
        html += "</option>\n"
        return html
    }
    override to_string(): string {
        return this.label
    }
}