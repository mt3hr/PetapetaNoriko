import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";
import { LabelType } from "./LabelType";

@serializable
export default class SubmitTagData extends HTMLTagDataBase {
    name = ""
    value = "送信"
    formaction = ""
    formenctype = ""
    formmethod = ""
    formnovalidate = false
    formtarget = ""
    label_type: LabelType = LabelType.None
    label = ""
    constructor() {
        super()
        this.tagname = "submit"
        this.focus_property_name = "value"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"submit\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.formaction != "") html += " formaction=\"" + this.formaction + "\""
        if (this.formenctype != "") html += " formenctype=\"" + this.formenctype + "\""
        if (this.formmethod != "") html += " formmethod=\"" + this.formmethod + "\""
        if (this.formnovalidate) html += " formnovalidate=\"" + this.formnovalidate + "\""
        if (this.formtarget != "") html += " formtarget=\"" + this.formtarget + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.value
    }
    override clone(): SubmitTagData {
        const c = new SubmitTagData()
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
        c.formaction = this.formaction
        c.formenctype = this.formenctype
        c.formmethod = this.formmethod
        c.formnovalidate = this.formnovalidate
        c.formtarget = this.formtarget
        c.label = this.label
        c.label_type = this.label_type
        return c
    }
}