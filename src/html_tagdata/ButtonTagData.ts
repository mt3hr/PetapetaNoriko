import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class ButtonTagData extends HTMLTagDataBase {
    name = ""
    value = "ボタン"
    constructor() {
        super()
        this.tagname = "button"
        this.focus_property_name = "value"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"button\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}