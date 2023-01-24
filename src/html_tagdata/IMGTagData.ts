import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

@serializable
export default class IMGTagData extends HTMLTagDataBase {
    src = ""
    alt = ""
    usemap = ""
    ismap = ""
    width = ""
    height = ""
    constructor() {
        super()
        this.tagname = "img"
        this.focus_property_name = "src"
    }
    override generate_html(options: GenerateHTMLOptions, indent: string): string {
        let html = ""
        html += indent
        html += "<img"
        if (options.export_id) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.src != "") {
            if (this.src.startsWith("data:image")) {
                if (!options.export_base64_image) html += " src=\"\""
                else html += " src=\"" + this.src + "\""
            } else {
                html += " src=\"" + this.src + "\""
            }
        }
        if (this.alt != "") html += " alt=\"" + this.alt + "\""
        if (this.usemap != "") html += " usemap=\"" + this.usemap + "\""
        if (this.ismap != "") html += " ismap=\"" + this.ismap + "\""
        if (this.height != "") html += " height=\"" + this.height + "\""
        if (this.width != "") html += " width=\"" + this.width + "\""
        html += ">"
        return html
    }
    override to_string(): string {
        return this.alt
    }
    override clone(): IMGTagData {
        const c = new IMGTagData()
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
        c.src = this.src
        c.alt = this.alt
        c.usemap = this.usemap
        c.ismap = this.ismap
        c.width = this.width
        c.height = this.height
        return c
    }
}