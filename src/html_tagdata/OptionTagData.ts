import HTMLTagDataBase, { GenerateHTMLOptions } from "./HTMLTagDataBase";

export default class OptionTagData extends HTMLTagDataBase {
    disabled = false
    label = "オプション"
    selected = false
    value = "オプション"
    constructor() {
        super()
        this.tagname = "option"
    }
    override generate_html(options: GenerateHTMLOptions): string {
        // TODO 
        return ""
    }
    override to_string(): string {
        return this.label
    }
}