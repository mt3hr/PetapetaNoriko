import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class EmailTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    maxlength = ""
    autocomplete = ""
    multiple = false
    pattern = ""
    placeholder = ""
    readonly = false
    required = false
    constructor() {
        super()
        this.tagname = "email"
        this.focus_property_name = "placeholder"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"email\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.maxlength != "") html += " maxlength=\"" + this.maxlength + "\""
        if (this.autocomplete) html += " autocomplete=\"" + this.autocomplete + "\""
        if (this.multiple) html += " multiple"
        if (this.pattern) html += " pattern=\"" + this.pattern + "\""
        if (this.placeholder != "") html += " placeholder=\"" + this.placeholder + "\""
        if (this.readonly) html += " readonly"
        if (this.required) html += " required"
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}