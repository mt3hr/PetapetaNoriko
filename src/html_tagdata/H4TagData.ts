import HTMLTagDataBase from "./HTMLTagDataBase";

export default class H4TagData extends HTMLTagDataBase {
    text = "見出し4"
    constructor() {
        super()
        this.tagname = "h4"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<h4"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h4>"
        return html
    }
}
