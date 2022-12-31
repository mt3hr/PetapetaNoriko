import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class H1TagData extends HTMLTagDataBase {
    text = "見出し1"
    constructor() {
        super()
        this.tagname = "h1"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<h1"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h1>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}