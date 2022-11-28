import PPMKComponentData from "./PPMKComponentData";
import PPMKComponentLiData from "./PPMKComponentLiData";

export default class PPMKComponentUlData extends PPMKComponentData {
    children_lis: Array<PPMKComponentLiData> = new Array<PPMKComponentLiData>()

    constructor(component_data: PPMKComponentData) {
        super(component_data, "ul")
    }

    override generateHTML(): string {
        let li_html = ""
        this.children_lis.forEach(li => { li_html += li.generateHTML() + "\n" })
        return "<ul>" + li_html + "</ul>"
    }

    override generateHTMLWithID(): string {
        let li_html = ""
        this.children_lis.forEach(li => { li_html += li.generateHTMLWithID() + "\n" })
        return '<ul id="' + this.id + '">' + li_html + "</ul>"
    }
}