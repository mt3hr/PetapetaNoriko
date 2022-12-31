import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ULTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "ul"
    }
    override generate_html(print_id_for_css: boolean): string {
        // TODO 
        return ""
    }
override to_string(): string {
        return "ul"
    }}