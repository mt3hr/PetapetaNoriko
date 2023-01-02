import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

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
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return this.name
    }
}