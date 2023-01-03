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
    tagname: string
    tagid = "id_" + generateUUID()
    tagclass = ""
    position_x: number
    position_y: number
    scale: number
    position_style: PositionStyle = PositionStyle.Absolute

    generate_html(options: GenerateHTMLOptions): string {
        return ""
    }
    generate_position_css(): string {
        if (this.position_style == PositionStyle.Absolute) {
            return "#" + this.tagid + " {\n  position: absolute;\n  left: " + this.position_x + "px;\n" + "  top: " + this.position_y + "px;\n}\n"
        } else {
            return "#" + this.tagid + " {\n  position: initial;\n}\n"
        }
    }
    to_string(): string {
        return "tagbase"
    }
}