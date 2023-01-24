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
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
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
    override clone(): ATagData {
        const c = new ATagData()
        c.child_tagdatas = new Array<HTMLTagDataBase>()
        this.child_tagdatas.forEach((child_tagdata) => { c.child_tagdatas.push(child_tagdata.clone()) })
        c.has_child_tag = this.has_child_tag
        c.tagname = this.tagname
        c.tagid = this.tagid
        c.tagclass = this.tagclass
        c.position_x = this.position_x
        c.position_y = this.position_y
        c.scale = this.scale
        c.position_style = this.position_style
        c.selected_this_tag = this.selected_this_tag
        c.focus_property_name = this.focus_property_name
        c.text = this.text
        c.href = this.href
        c.name = this.name
        c.charset = this.charset
        c.hreflang = this.hreflang
        c.type = this.type
        c.rel = this.rel
        c.rev = this.rev
        c.tabindex = this.tabindex
        c.accesskey = this.accesskey
        c.shape = this.shape
        c.coords = this.coords
        return c
    }
}