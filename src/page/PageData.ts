import HTMLTagDataBase from "@/html_tagdata/HTMLTagDataBase"

export default class PageData {
    pagename = ""
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()

    generate_html(print_id_for_css: boolean): string {
        let html = ""
        html += "<html>"
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            const tagdata = this.html_tagdatas[i]
            html += "  " + tagdata.generate_html(print_id_for_css)
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