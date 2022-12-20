import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class H2TagData extends HTMLTagDataBase {
    text = "見出し2"
    constructor() {
        super()
        this.tagname = "h2"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<h2"
        if (print_id_for_css) html += " id=\""+this.tagid+"\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h2>"
        return html
    }

}