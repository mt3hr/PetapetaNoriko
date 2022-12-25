import HTMLTagDataBase from "./HTMLTagDataBase";

export default class FileTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    accept = ""
    multiple = false
    required = false
    constructor() {
        super()
        this.tagname = "file"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}