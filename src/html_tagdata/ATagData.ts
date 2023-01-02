import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class ATagData extends HTMLTagDataBase {
    text = "リンク"
    href = ""
    name = ""
    charset = ""
    hreflang = ""
    type = ""
    rel = ""
    rev = ""
    tabindex = ""
    accesskey = ""
    shape = ""
    coords = ""
    constructor() {
        super()
        this.tagname = "a"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<a"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.href != "") html += " href=\"" + this.href + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.charset != "") html += " charset=\"" + this.charset + "\""
        if (this.hreflang != "") html += " hreflang\"" + this.hreflang + "\""
        if (this.type != "") html += " type\"" + this.type + "\""
        if (this.rel != "") html += " rel\"" + this.rel + "\""
        if (this.tabindex != "") html += " tabindex\"" + this.tabindex + "\""
        if (this.accesskey != "") html += " accesskey\"" + this.accesskey + "\""
        if (this.shape != "") html += " shape\"" + this.shape + "\""
        if (this.coords != "") html += " coords\"" + this.coords + "\""
        html += ">"
        html += this.text
        html += "</a>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}