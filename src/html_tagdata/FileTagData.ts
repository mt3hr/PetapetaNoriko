import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class FileTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    accept = ""
    multiple = false
    required = false
    constructor() {
        super()
        this.tagname = "file"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"file\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.accept != "") html += " accept=\"" + this.accept + "\""
        if (this.multiple) html += " multiple"
        if (this.required) html += " required"
        html += ">"
        return html
    }
}