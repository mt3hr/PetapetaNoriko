import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class ButtonTagData extends HTMLTagDataBase {
    name = ""
    value = "ボタン"
    constructor() {
        super()
        this.tagname = "button"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"button\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
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