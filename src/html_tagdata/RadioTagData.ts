import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class RadioTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    required = false
    constructor() {
        super()
        this.tagname = "radio"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"radio\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.checked) html += " checked"
        if (this.required) html += " required"
        html += ">"
        return html
    }
}