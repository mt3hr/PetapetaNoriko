import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class PTagData extends HTMLTagDataBase {
    text = "段落"
    constructor() {
        super()
        this.tagname = "p"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<p"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</p>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}