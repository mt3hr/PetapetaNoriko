import HTMLTagDataBase from "./HTMLTagDataBase";

export default class FileTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = "1"
    accept = ""
    multiple = false
    required = false
    constructor() {
        super()
        this.tagname = "file"
    }
}