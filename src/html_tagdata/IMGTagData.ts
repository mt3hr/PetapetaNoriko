import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

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
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<img"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.src != "") html += " src=\"" + this.src + "\""
        if (this.alt != "") html += " alt=\"" + this.alt + "\""
        if (this.usemap != "") html += " usemap=\"" + this.usemap + "\""
        if (this.ismap != "") html += " ismap=\"" + this.ismap + "\""
        if (this.height != "") html += " height=\"" + this.height + "\""
        if (this.width != "") html += " width=\"" + this.width + "\""
        html += ">"
        return html
    }
}