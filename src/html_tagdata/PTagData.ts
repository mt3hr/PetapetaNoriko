import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class PTagData extends HTMLTagDataBase {
    text = "段落"
    constructor() {
        super()
        this.tagname = "p"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<p"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</p>"
        return html
    }
}