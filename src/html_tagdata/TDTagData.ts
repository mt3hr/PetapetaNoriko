import HTMLTagDataBase from "./HTMLTagDataBase";

export default class TDData extends HTMLTagDataBase {
    colspan = ""
    rowspan = ""
    headers = ""
    constructor() {
        super()
        this.tagname = "td"
    }
}