import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class NumberTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = ""
    list = ""
    max = ""
    min = ""
    readonly = false
    required = false
    step = ""
    constructor() {
        super()
        this.tagname = "number"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<input type=\"number\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.autocomplete) html += " autocomplete=\"" + this.autocomplete + "\""
        if (this.list != "") html += " list=\"" + this.list + "\""
        if (this.max != "") html += " max=\"" + this.max + "\""
        if (this.min != "") html += " min=\"" + this.min + "\""
        if (this.required) html += " required"
        if (this.step != "") html += " =\"" + this.step + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}