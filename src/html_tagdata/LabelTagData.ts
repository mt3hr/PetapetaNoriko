import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class LabelTagData extends HTMLTagDataBase {
    form = ""
    for = ""
    text = ""
    constructor() {
        super()
        this.tagname = "label"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<label"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.form != "") html += " form=\"" + this.form + "\""
        if (this.for != "") html += " for=\"" + this.for + "\""
        html += ">" + this.text + "</label>"
        return html
    }
    override to_string(): string {
        return this.text
    }
}