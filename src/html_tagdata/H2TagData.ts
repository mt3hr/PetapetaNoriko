import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class H2TagData extends HTMLTagDataBase {
    text = "見出し2"
    constructor() {
        super()
        this.tagname = "h2"
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<h2"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h2>"
        return html
    }

    override to_string(): string {
        return this.text
    }
}