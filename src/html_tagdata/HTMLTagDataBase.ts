import generateUUID from "@/uuid"

export default class HTMLTagDataBase {
    tagname: string
    tagid = generateUUID()
    position_x: number
    position_y: number
    generate_html(): string {
        return ""
    }
    generate_html_with_id(): string {
        return ""
    }
    generate_position_css() : string {
        return ""
    }
}