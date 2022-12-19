import generateUUID from "@/uuid"
import StyleType from "./StyleType"

export default class PPMKComponentData {
    tagname: string
    id: string
    x: number
    y: number
    parent_id: string
    styletype: StyleType = StyleType.RELATIVE

    constructor(component_data: PPMKComponentData = null, tagname: string) {
        if (component_data != null) {
            this.tagname = component_data.tagname
            this.id = component_data.id
            this.x = component_data.y
        } else {
            this.tagname = tagname
            this.id = generateUUID()
        }
    }

    generateHTML(): string {
        return ""
    }

    generateHTMLWithID(): string {
        return ""
    }

    generateCSS(): string {
        switch (this.styletype) {
            case StyleType.NONE:
                return "#" + this.id + " {}\n"
            case StyleType.RELATIVE:
                return "#" + this.id + " {\n  position: relative;\n  left: " + this.x + "px;\n" + "  top: " + this.y + "px;\n}\n"
        }
    }
}