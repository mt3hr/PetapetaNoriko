import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TableTagData extends HTMLTagDataBase {
    disabled = false
    label = "テーブル"
    selected = false
    value = "テーブル"
    constructor() {
        super()
        this.tagname = "table"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}