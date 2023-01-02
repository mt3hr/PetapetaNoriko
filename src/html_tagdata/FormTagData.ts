import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class FormTagData extends HTMLTagDataBase {
    acceptcharset = ""
    action = ""
    autocomplete = ""
    enctype = ""
    method = ""
    name = ""
    novalidate = true
    target = ""
    constructor() {
        super()
        this.tagname = "form"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return this.name
    }
}