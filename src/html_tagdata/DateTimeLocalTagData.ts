import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";
import { LabelType } from "./LabelType";

@serializable
export default class DateTimeLocalTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    autocomplete = ""
    list = ""
    max = ""
    min = ""
    readonly = false
    required = false
    step = ""
    label_type: LabelType = LabelType.None
    label = ""
    constructor() {
        super()
        this.tagname = "datetimelocal"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<input type=\"date-time-local\""
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.autocomplete) html += " autocomplete=\"" + this.autocomplete + "\""
        if (this.list != "") html += " list=\"" + this.list + "\""
        if (this.max != "") html += " max=\"" + this.max + "\""
        if (this.min != "") html += " min=\"" + this.min + "\""
        if (this.readonly) html += " readonly"
        if (this.required) html += " required"
        if (this.step != "") html += " =\"" + this.step + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.name
    }
    override clone(): DateTimeLocalTagData {
        const c = new DateTimeLocalTagData()
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
        c.autocomplete = this.autocomplete
        c.list = this.list
        c.max = this.max
        c.min = this.min
        c.readonly = this.readonly
        c.required = this.required
        c.step = this.step
        c.label = this.label
        c.label_type = this.label_type
        return c
    }
}