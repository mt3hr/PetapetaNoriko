import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class ColorTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = ""
    constructor() {
        super()
        this.tagname = "color"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<input type=\"color\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.autocomplete) html += " autocomplete=\"" + this.autocomplete + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}