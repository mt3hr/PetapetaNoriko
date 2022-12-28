import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class RadioTagData extends HTMLTagDataBase {
    value = ""
    constructor() {
        super()
        this.tagname = "radio"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"reset\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">"
        return html
    }
}