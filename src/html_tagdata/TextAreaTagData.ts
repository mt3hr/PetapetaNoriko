import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class TextAreaTagData extends HTMLTagDataBase {
    autofocus = false
    cols = ""
    disabled = false
    form = ""
    maxlength = ""
    name = ""
    placeholder = ""
    readonly = false
    required = false
    rows = ""
    wrap = ""
    constructor() {
        super()
        this.tagname = "textarea"
        this.focus_property_name = "placeholder"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<textarea"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.autofocus) html += " autofocus"
        if (this.cols != "") html += " cols=\"" + this.cols + "\""
        if (this.disabled) html += " disabled"
        if (this.form != "") html += " form=\"" + this.form + "\""
        if (this.maxlength != "") html += " maxlength=\"" + this.maxlength + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.placeholder != "") html += " placeholder=\"" + this.placeholder + "\""
        if (this.readonly) html += " readonly"
        if (this.required) html += " required"
        if (this.rows != "") html += " rows=\"" + this.rows + "\""
        if (this.wrap != "") html += " wrap=\"" + this.wrap + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
    override clone(): TextAreaTagData {
        const c = new TextAreaTagData()
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
        c.cols = this.cols
        c.disabled = this.disabled
        c.form = this.form
        c.maxlength = this.maxlength
        c.name = this.name
        c.placeholder = this.placeholder
        c.readonly = this.readonly
        c.required = this.required
        c.rows = this.rows
        c.wrap = this.wrap
        return c
    }

}