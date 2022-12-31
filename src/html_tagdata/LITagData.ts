import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class LITagData extends HTMLTagDataBase {
    text = "リストアイテム"
    value = ""
    constructor() {
        super()
        this.tagname = "li"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<li"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">" + this.text + "</label>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}