import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class ColorTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = ""
    constructor() {
        super()
        this.tagname = "color"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"color\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.autocomplete) html += " autocomplete=\"" + this.autocomplete + "\""
        html += ">"
        return html
    }
}