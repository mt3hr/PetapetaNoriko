import PPMKComponentData from "./PPMKComponentData";

export default class PPMKComponentLiData extends PPMKComponentData {
    text: string

    constructor(component_data: PPMKComponentData, text = "リストアイテム",) {
        super(component_data, "li")
        this.text = text
    }

    override generateHTML(): string {
        return "<li>" + this.text + "</li>"
    }

    override generateHTMLWithID(): string {
        return '<li id="' + this.id + '">' + this.text + "</li>"
    }
}