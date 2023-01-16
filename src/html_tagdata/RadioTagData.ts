import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class RadioTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    required = false
    constructor() {
        super()
        this.tagname = "radio"
        this.focus_property_name = "checked"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"radio\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.checked) html += " checked"
        if (this.required) html += " required"
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}