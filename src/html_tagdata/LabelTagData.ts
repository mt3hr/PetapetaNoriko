import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class LabelTagData extends HTMLTagDataBase {
    form = ""
    for = ""
    text = "ラベル"
    constructor() {
        super()
        this.tagname = "label"
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<label"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.form != "") html += " form=\"" + this.form + "\""
        if (this.for != "") html += " for=\"" + this.for + "\""
        html += ">" + this.text + "</label>"
        return html
    }
    override to_string(): string {
        return this.text
    }
    clone(): LabelTagData {
        const c = new LabelTagData()
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
        c.form = this.form
        c.for = this.for
        c.text = this.text
        return c
    }
}