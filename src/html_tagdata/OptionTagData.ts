import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class OptionTagData extends HTMLTagDataBase {
    disabled = false
    label = "オプション"
    selected = false
    value = "オプション"
    constructor() {
        super()
        this.tagname = "option"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<option"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.disabled) html += " disabled"
        if (this.label != "") html += " label=\"" + this.label + "\""
        if (this.selected) html += " selected"
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">"
        html += this.label
        html += "</option>"
        return html
    }
    override to_string(): string {
        return this.label
    }
    override clone(): OptionTagData {
        const c = new OptionTagData()
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