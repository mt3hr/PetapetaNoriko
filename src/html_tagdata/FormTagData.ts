import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class FormTagData extends HTMLTagDataBase {
    acceptcharset = ""
    action = ""
    autocomplete = ""
    enctype = ""
    method = ""
    name = ""
    novalidate = false
    target = ""
    constructor() {
        super()
        this.tagname = "form"
        this.has_child_tag = true
        this.focus_property_name = "method"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<form"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.acceptcharset != "") html += " acceptcharset=\"" + this.acceptcharset + "\""
        if (this.action != "") html += " action=\"" + this.action + "\""
        if (this.autocomplete != "") html += " autocomplete=\"" + this.autocomplete + "\""
        if (this.enctype != "") html += " enctype=\"" + this.enctype + "\""
        if (this.method != "") html += " method=\"" + this.method + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.novalidate) html += " novalidate"
        if (this.target != "") html += " =\"" + this.target + "\""
        html += ">\n"
        for (let i = 0; i < this.child_tagdatas.length; i++) {
            html += this.child_tagdatas[i].generate_html(options, indent + "    ")
            html += "\n"
        }
        html += indent
        html += "</form>"
        return html
    }
    override to_string(): string {
        return this.name
    }
    override clone(): FormTagData {
        const c = new FormTagData()
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
        c.acceptcharset = this.acceptcharset
        c.action = this.action
        c.autocomplete = this.autocomplete
        c.enctype = this.enctype
        c.method = this.method
        c.name = this.name
        c.novalidate = this.novalidate
        c.target = this.target
        return c
    }
}