import generateUUID from "@/uuid"

export default class HTMLTagDataBase {
    tagname: string
    tagid = generateUUID()
    tagclass = ""
    position_x: number
    position_y: number
    generate_html(print_id_for_css: boolean): string {
        return ""
    }
    generate_position_css(): string {
        return "#" + this.tagid + " {\n  position: relative;\n  left: " + this.position_x + "px;\n" + "  top: " + this.position_y + "px;\n}\n"
    }
}