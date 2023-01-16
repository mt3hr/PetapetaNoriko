import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class H5TagData extends HTMLTagDataBase {
    text = "見出し5"
    constructor() {
        super()
        this.tagname = "h5"
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<h5"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h5>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}