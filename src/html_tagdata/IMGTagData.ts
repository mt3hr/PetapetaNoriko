import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class IMGTagData extends HTMLTagDataBase {
    src = ""
    alt = ""
    usemap = ""
    ismap = ""
    width = ""
    height = ""
    constructor() {
        super()
        this.tagname = "img"
        this.focus_property_name = "src"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<img"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.src != "") {
            if (this.src.startsWith("data:image")) {
                if (!options.export_base64_image) html += " src=\"\""
                else html += " src=\"" + this.src + "\""
            } else {
                html += " src=\"" + this.src + "\""
            }
        }
        if (this.alt != "") html += " alt=\"" + this.alt + "\""
        if (this.usemap != "") html += " usemap=\"" + this.usemap + "\""
        if (this.ismap != "") html += " ismap=\"" + this.ismap + "\""
        if (this.height != "") html += " height=\"" + this.height + "\""
        if (this.width != "") html += " width=\"" + this.width + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.alt
    }
}