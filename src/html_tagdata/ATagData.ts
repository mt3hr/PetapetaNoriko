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
}