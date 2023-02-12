import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";
import { LabelType } from "./LabelType";

@serializable
export default class ImageTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    src = ""
    alt = ""
    height = ""
    width = ""
    formaciton = ""
    formenctype = ""
    formmethod = ""
    formnovalidate = true
    formtarget = ""
    label_type: LabelType = LabelType.None
    label = ""
    constructor() {
        super()
        this.tagname = "image"
        this.focus_property_name = "src"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        if (this.label_type != LabelType.None) html += "<label>"
        if (this.label_type == LabelType.Before) html += this.label
        html += "<input type=\"image\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.src != "") {
            if (this.src.startsWith("data:image")) {
                if (!options.export_base64_image) html += " src=\"\""
                else html += " src=\"" + this.src + "\""
            } else {
                html += " src=\"" + this.src + "\""
            }
        }
        if (this.alt != "") html += " alt=\"" + this.alt + "\""
        if (this.height != "") html += " height=\"" + this.height + "\""
        if (this.width != "") html += " width=\"" + this.width + "\""
        if (this.formaciton != "") html += " formaction=\"" + this.formaciton + "\""
        if (this.formenctype != "") html += " formenctype=\"" + this.formenctype + "\""
        if (this.formmethod != "") html += " formmethod=\"" + this.formmethod + "\""
        if (this.formnovalidate) html += " formnovalidate"
        if (this.formtarget != "") html += " formtarget=\"" + this.formtarget + "\""
        html += ">"
        if (this.label_type == LabelType.After) html += this.label
        if (this.label_type != LabelType.None) html += "</label>"
        return html
    }
    override to_string(): string {
        return this.name
    }
    override clone(): ImageTagData {
        const c = new ImageTagData()
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
        c.src = this.src
        c.alt = this.alt
        c.height = this.height
        c.width = this.width
        c.formaciton = this.formaciton
        c.formenctype = this.formenctype
        c.formmethod = this.formmethod
        c.formnovalidate = this.formnovalidate
        c.formtarget = this.formtarget
        c.label = this.label
        c.label_type = this.label_type
        return c
    }
}