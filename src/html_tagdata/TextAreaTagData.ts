import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class TextAreaTagData extends HTMLTagDataBase {
    autofocus = false
    cols = ""
    disabled = false
    form = ""
    maxlength = ""
    name = ""
    placeholder = ""
    readonly = false
    required = false
    rows = ""
    wrap = ""
    constructor() {
        super()
        this.tagname = "textarea"
        this.focus_property_name = "placeholder"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<textarea"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.autofocus) html += " autofocus"
        if (this.cols != "") html += " cols=\"" + this.cols + "\""
        if (this.disabled) html += " disabled"
        if (this.form != "") html += " form=\"" + this.form + "\""
        if (this.maxlength != "") html += " maxlength=\"" + this.maxlength + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.placeholder != "") html += " placeholder=\"" + this.placeholder + "\""
        if (this.readonly) html += " readonly"
        if (this.required) html += " required"
        if (this.rows != "") html += " rows=\"" + this.rows + "\""
        if (this.wrap != "") html += " wrap=\"" + this.wrap + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}