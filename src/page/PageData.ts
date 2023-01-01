import HTMLTagDataBase from "@/html_tagdata/HTMLTagDataBase"
import { serializable } from "@/serializable/serializable"
import generateUUID from "@/uuid"

@serializable
export default class PageData {
    pageid = generateUUID()
    pagename = "ページ"
    width = 1060
    height = 710
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
    css: string

    generate_html(print_id_for_css: boolean, print_head: boolean): string {
        let html = ""
        html += "<html>\n"
        if (print_head) {
            html += "  <head>\n"
            html += "    <title>" + this.pagename + "</title>\n"
            html += "    <link rel=\"stylesheet\" href=\"" + this.pagename + ".css\">\n"
            html += "  </head>\n"
        }
        html += "  <body>\n"
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            const tagdata = this.html_tagdatas[i]
            html += "    " + tagdata.generate_html(print_id_for_css) + "\n"
        }
        html += "  </body>\n"
        html += "</html>\n"
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