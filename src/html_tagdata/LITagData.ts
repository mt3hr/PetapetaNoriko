import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class LITagData extends HTMLTagDataBase {
    text = "リストアイテム"
    value = ""
    constructor() {
        super()
        this.tagname = "li"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<li"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">" + this.text + "</li>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}