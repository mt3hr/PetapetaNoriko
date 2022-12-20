import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ATagData extends HTMLTagDataBase {
    text = "リンク"
    href = ""
    name = ""
    charset = ""
    hreflang = ""
    type = ""
    rel = ""
    rev = ""
    tabindex = ""
    accesskey = ""
    shape = ""
    coords = ""
    constructor() {
        super()
        this.tagname = "a"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}