import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class CheckBoxTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    constructor() {
        super()
        this.tagname = "checkbox"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"checkbox\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.checked) html += " checked"
        html += ">"
        return html
    }
}