import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class LabelTagData extends HTMLTagDataBase {
    form = ""
    for = ""
    text = "ラベル"
    constructor() {
        super()
        this.tagname = "label"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<label"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.form != "") html += " form=\"" + this.form + "\""
        if (this.for != "") html += " for=\"" + this.for + "\""
        html += ">" + this.text + "</label>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}