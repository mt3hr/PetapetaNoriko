import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class TableTagData extends HTMLTagDataBase {
    disabled = false
    label = "テーブル"
    selected = false
    value = "テーブル"
    constructor() {
        super()
        this.tagname = "table"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return "table"
    }
}