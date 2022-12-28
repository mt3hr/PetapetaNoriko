import { serializable } from "@/serializable/serializable";
import HTMLTagDataBase from "./HTMLTagDataBase";

@serializable
export default class RadioTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    formaction = ""
    formenctype = ""
    formmethod = ""
    formnovalidate = false
    formtarget = ""
    constructor() {
        super()
        this.tagname = "radio"
    }
    override generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<input type=\"submit\""
        if (print_id_for_css) html += " id=\"" + this.tagid + "\""
        if (this.tagclass != "") html += " class=\"" + this.tagclass + "\""
        if (this.name != "") html += " name=\"" + this.name + "\""
        if (this.value != "") html += " value=\"" + this.value + "\""
        if (this.formaction != "") html += " formaction=\"" + this.formaction + "\""
        if (this.formenctype != "") html += " formenctype=\"" + this.formenctype + "\""
        if (this.formmethod != "") html += " formmethod=\"" + this.formmethod + "\""
        if (this.formnovalidate) html += " formnovalidate=\"" + this.formnovalidate + "\""
        if (this.formtarget != "") html += " formtarget=\"" + this.formtarget + "\""
        html += ">"
        return html
    }
}