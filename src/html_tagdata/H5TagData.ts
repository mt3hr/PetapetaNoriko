import HTMLTagDataBase from "./HTMLTagDataBase";

export default class H5TagData extends HTMLTagDataBase {
    text = "見出し5"
    constructor() {
        super()
        this.tagname = "h5"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<h5"
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        html += ">" + this.text + "</h5>"
        return html
    }
}