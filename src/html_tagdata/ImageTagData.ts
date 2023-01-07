import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class ImageTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    src = ""
    alt = ""
    height = ""
    width = ""
    formaciton = ""
    formenctype = ""
    formmethod = ""
    formnovalidate = true
    formtarget = ""
    constructor() {
        super()
        this.tagname = "image"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"image\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.src != "") {
            if (this.src.startsWith("data:image")) {
                if (!options.export_base64_image) html += " src=\"\""
                else html += " src=\"" + this.src + "\""
            } else {
                html += " src=\"" + this.src + "\""
            }
        }
        if (this.alt != "") html += " alt=\"" + this.alt + "\""
        if (this.height != "") html += " height=\"" + this.height + "\""
        if (this.width != "") html += " width=\"" + this.width + "\""
        if (this.formaciton != "") html += " formaction=\"" + this.formaciton + "\""
        if (this.formenctype != "") html += " formenctype=\"" + this.formenctype + "\""
        if (this.formmethod != "") html += " formmethod=\"" + this.formmethod + "\""
        if (this.formnovalidate) html += " formnovalidate"
        if (this.formtarget != "") html += " formtarget=\"" + this.formtarget + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
}