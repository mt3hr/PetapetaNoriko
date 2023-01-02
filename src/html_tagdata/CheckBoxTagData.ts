import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class CheckBoxTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    constructor() {
        super()
        this.tagname = "checkbox"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<input type=\"checkbox\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.checked) html += " checked"
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}