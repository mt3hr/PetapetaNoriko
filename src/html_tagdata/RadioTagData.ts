import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";
import { LabelType } from "./LabelType";

@serializable
export default class RadioTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    checked = false
    required = false
    label_type: LabelType = LabelType.None
    label = ""
    constructor() {
        super()
        this.tagname = "radio"
        this.focus_property_name = "checked"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"radio\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.checked) html += " checked"
        if (this.required) html += " required"
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
    override clone(): RadioTagData {
        const c = new RadioTagData()
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
        c.name = this.name
        c.value = this.value
        c.checked = this.checked
        c.required = this.required
        c.label = this.label
        c.label_type = this.label_type
        return c
    }
}