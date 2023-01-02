import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class ULTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "ul"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
override to_string(): string {
        return "ul"
    }}