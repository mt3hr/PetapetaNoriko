import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class H4TagData extends HTMLTagDataBase {
    text = "見出し4"
    constructor() {
        super()
        this.tagname = "h4"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<h4"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h4>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}