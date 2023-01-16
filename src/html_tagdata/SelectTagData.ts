import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class SelectTagData extends HTMLTagDataBase {
    autofocus = false
    disabled = false
    multiple = false
    name = ""
    size = ""
    constructor() {
        super()
        this.tagname = "select"
        this.has_child_tag = true
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<select"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.autofocus) html += " autofocus"
        if (this.disabled) html += " disabled"
        if (this.multiple) html += " multiple"
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.size != "") html += " size=\"" + this.size + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</select>"
        return html
    }
    override to_string(): string {
        return this.name
    }
    override clone(): SelectTagData {
        const c = new SelectTagData()
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
        c.autofocus = this.autofocus
        c.disabled = this.disabled
        c.multiple = this.multiple
        c.name = this.name
        c.size = this.size
        return c
    }
}