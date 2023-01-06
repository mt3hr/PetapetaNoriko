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
    tagname: string
    tagid = "id_" + generateUUID()
    tagclass = ""
    position_x: number
    position_y: number
    scale: number
    position_style: PositionStyle = PositionStyle.Absolute
    selected_this_tag = false

    generate_html(options: GenerateHTMLOptions, indent: string): string {
        return ""
    }
    generate_position_css(): string {
        let style = "#" + this.tagid + " {\n"
        if (this.position_style == PositionStyle.Absolute) {
            style += "position: absolute;\n  left: " + this.position_x + "px;\n" + "  top: " + this.position_y + "px;\n"
        } else {
            style += "position: initial;\n"
        }
        style += "}\n"
        return style
    }
    to_string(): string {
        return "tagbase"
    }
}