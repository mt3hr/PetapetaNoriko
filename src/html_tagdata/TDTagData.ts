import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class TDTagData extends HTMLTagDataBase {
    colspan = ""
    rowspan = ""
    headers = ""
    text = ""
    constructor() {
        super()
        this.tagname = "td"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<td"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.colspan != "") html += " colspan=\"" + this.colspan + "\""
        if (this.rowspan != "") html += " rowspan=\"" + this.rowspan + "\""
        if (this.headers != "") html += " headers=\"" + this.headers + "\""
        html += ">\n"
        html += this.text
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</td>"
        return html
    }
    override to_string(): string {
        return "td"
    }
    override clone(): TDTagData {
        const c = new TDTagData()
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
        c.colspan = this.colspan
        c.rowspan = this.rowspan
        c.headers = this.headers
        c.text = this.text
        return c
    }
}