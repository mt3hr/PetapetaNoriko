import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class H6TagData extends HTMLTagDataBase {
    text = "見出し6"
    constructor() {
        super()
        this.tagname = "h6"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<h6"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h6>"
        return html
    }
override to_string(): string {
        return this.text
    }
}