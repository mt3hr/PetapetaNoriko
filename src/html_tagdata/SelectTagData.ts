import HTMLTagDataBase from "./HTMLTagDataBase";

export default class SelectTagData extends HTMLTagDataBase {
    autofocus = false
    disabled = false
    multiple = false
    name = "セレクトボックス"
    size = ""
    constructor() {
        super()
        this.tagname = "select"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return this.name
    }
}