import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TRTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "tr"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
override to_string(): string {
        return "tr"
    }}