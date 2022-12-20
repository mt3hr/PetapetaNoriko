import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ButtonTagData extends HTMLTagDataBase {
    name = ""
    value = "ボタン"
    constructor() {
        super()
        this.tagname = "button"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
}