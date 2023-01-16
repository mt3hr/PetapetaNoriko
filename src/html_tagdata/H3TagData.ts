import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class H3TagData extends HTMLTagDataBase {
    text = "見出し3"
    constructor() {
        super()
        this.tagname = "h3"
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<h3"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h3>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}