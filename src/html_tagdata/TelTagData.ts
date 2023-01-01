import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class TelTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    maxlength = ""
    autocomplete = ""
    pattern = ""
    placeholder = ""
    readonly = false
    required = false
    list = ""
    constructor() {
        super()
        this.tagname = "tel"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"tel\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.size != "") html += " size=\"" + this.size + "\""
        if (this.maxlength != "") html += " maxlength=\"" + this.maxlength + "\""
        if (this.autocomplete != "") html += " autocomplete=\"" + this.autocomplete + "\""
        if (this.pattern != "") html += " pattern=\"" + this.pattern + "\""
        if (this.placeholder != "") html += " placeholder=\"" + this.placeholder + "\""
        if (this.readonly) html += " readonly"
        if (this.required) html += " required"
        if (this.list != "") html += " =\"" + this.list + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}