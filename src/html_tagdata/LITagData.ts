import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class LITagData extends HTMLTagDataBase {
    text = ""
    value = ""
    constructor() {
        super()
        this.tagname = "li"
        this.has_child_tag = true
        this.focus_property_name = "text"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<li"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        html += ">"
        html += this.text + "</li>"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        return html
    }
    override to_string(): string {
        return this.text
    }
    override clone(): LITagData {
        const c = new LITagData()
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
        c.value = this.value
        return c
    }
}