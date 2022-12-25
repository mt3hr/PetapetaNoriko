import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ImageTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    src = ""
    alt = ""
    height = ""
    width = ""
    formaciton = ""
    formenctype = ""
    formmethod = ""
    formnovalidate = true
    formtarget = ""
    constructor() {
        super()
        this.tagname = "image"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}