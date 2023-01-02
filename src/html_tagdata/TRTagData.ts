import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class TRTagData extends HTMLTagDataBase {
    constructor() {
        super()
        this.tagname = "tr"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
override to_string(): string {
        return "tr"
    }}