import { serializable } from "@/serializable/serializable"
import generateUUID from "@/uuid"

export class GenerateHTMLOptions {
    export_id: boolean
    export_base64_image: boolean
    export_head: boolean
}

@serializable
export default class HTMLTagDataBase {
    child_tags: Array<HTMLTagDataBase>
    tagname: string
    tagid = generateUUID()
    tagclass = ""
    position_x: number
    position_y: number
    scale: number
    generate_html(options: GenerateHTMLOptions): string {
        return ""
    }
    generate_position_css(): string {
        return "#" + this.tagid + " {\n  position: relative;\n  left: " + this.position_x + "px;\n" + "  top: " + this.position_y + "px;\n}\n"
    }
    to_string(): string {
        return "tagbase"
    }
}