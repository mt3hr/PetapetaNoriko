import { serializable } from "@/serializable/serializable"
import generateUUID from "@/uuid"

export enum PositionStyle {
    Absolute,
    None,
}

export class GenerateHTMLOptions {
    export_id: boolean
    export_base64_image: boolean
    export_head: boolean
    export_position_css: boolean
}

@serializable
export default class HTMLTagDataBase {
    child_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
    has_child_tag: boolean
    tagname = "tagbase"
    tagid = "id_" + generateUUID()
    tagclass = ""
    position_x: number
    position_y: number
    scale: number
    position_style: PositionStyle = PositionStyle.Absolute
    selected_this_tag = false
    focus_property_name: string

    generate_html(options: GenerateHTMLOptions, indent: string): string {
        return ""
    }
    generate_position_css(): string {
        let style = "#" + this.tagid + " {\n"
        if (this.position_style == PositionStyle.Absolute) {
            style += "  position: absolute;\n  left: " + this.position_x + "px;\n" + "  top: " + this.position_y + "px;\n"
        } else {
            style += "  position: initial;\n"
        }
        style += "}\n"
        return style
    }
    to_string(): string {
        return "tagbase"
    }
    clone(): HTMLTagDataBase {
        const c = new HTMLTagDataBase()
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
        return c
    }
}