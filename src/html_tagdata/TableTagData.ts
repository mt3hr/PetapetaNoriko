import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class TableTagData extends HTMLTagDataBase {
    disabled = false
    label = ""
    selected = false
    value = ""
    constructor() {
        super()
        this.tagname = "table"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<table"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.disabled) html += " disabled"
        if (this.label != "") html += " label=\"" + this.label + "\""
        if (this.selected) html += " selected"
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</table>"
        return html
    }
    override to_string(): string {
        return "table"
    }
    override clone(): TableTagData {
        const c = new TableTagData()
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
        c.disabled = this.disabled
        c.label = this.label
        c.selected = this.selected
        c.value = this.value
        return c
    }

}