import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class H3TagData extends HTMLTagDataBase {
    text = "見出し3"
    constructor() {
        super()
        this.tagname = "h3"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<h3"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h3>"
        return html
    }
}