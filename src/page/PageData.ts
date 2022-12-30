import HTMLTagDataBase from "@/html_tagdata/HTMLTagDataBase"
import { serializable } from "@/serializable/serializable"
import generateUUID from "@/uuid"

@serializable
export default class PageData {
    pageid = generateUUID()
    pagename = "ページ"
    width = 700
    height = 750
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()

    generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<html>\n"
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            const tagdata = this.html_tagdatas[i]
            html += "  " + tagdata.generate_html(print_id_for_css) + "\n"
        }
        html += "</html>"
        return html
    }

    generateCSS(): string {
        let css = ""
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            const tagdata = this.html_tagdatas[i]
            css += tagdata.generate_position_css()
        }
        return css
    }
}