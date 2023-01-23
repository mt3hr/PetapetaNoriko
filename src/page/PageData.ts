import HTMLTagDataBase, { GenerateHTMLOptions, PositionStyle } from "@/html_tagdata/HTMLTagDataBase"
import { serializable } from "@/serializable/serializable"
import generateUUID from "@/uuid"

@serializable
export default class PageData {
    pageid = generateUUID()
    pagename = "ページ"
    width = window.innerWidth - 300 - 300 - 19
    height = window.innerHeight - 159
    html_tagdatas = new Array<HTMLTagDataBase>()
    css =  ""
    webfonts: Array<string> = new Array<string>()

    generate_html(options: GenerateHTMLOptions): string {
        let html = ""
        html += "<html>\n"
        if (options.export_head) {
            html += "  <head>\n"
            html += "    <title>" + this.pagename + "</title>\n"
            html += "    <link rel=\"stylesheet\" href=\"" + this.pagename + ".css\">\n"
            if (options.export_position_css) {
                html += "    <style>\n"
                for (let i = 0; i < this.html_tagdatas.length; i++) {
                    const tagdata = this.html_tagdatas[i]
                    if (tagdata.position_style != PositionStyle.None) {
                        html += tagdata.generate_position_css()
                    }
                }
                html += "    </style>\n"
            }
            for (let i = 0; i < this.webfonts.length; i++) {
                const webfont = this.webfonts[i]
                html += "    <link rel=\"stylesheet\" href=\"" + webfont + "\">\n"
            }
            html += "  </head>\n"
        }
        html += "  <body>\n"
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            const tagdata = this.html_tagdatas[i]
            html += tagdata.generate_html(options, "    ") + "\n"
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
    clone(): PageData {
        const c = new PageData()
        c.pageid = this.pageid
        c.pagename = this.pagename
        c.width = this.width
        c.height = this.height
        c.html_tagdatas = new Array<HTMLTagDataBase>()
        if (this.html_tagdatas != null) {
            this.html_tagdatas.forEach((child_tagdata) => { c.html_tagdatas.push(child_tagdata.clone()) })
        }
        c.css = this.css
        c.webfonts = this.webfonts
        return c
    }
}