import HTMLTagDataBase from "./HTMLTagDataBase";

export default class ImageTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    src = ""
    alt = ""
    height = ""
    width = ""
    formaciton = ""
    formenctype = "application/x-www-form-urlencoded"
    formmethod = "get"
    formnovalidate = true
    formtarget = ""
    constructor() {
        super()
        this.tagname = "image"
    }
}