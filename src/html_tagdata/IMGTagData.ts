import HTMLTagDataBase from "./HTMLTagDataBase";

export default class IMGTagData extends HTMLTagDataBase {
    src = ""
    alt = ""
    usemap = ""
    ismap = ""
    width = ""
    height = ""
    constructor() {
        super()
        this.tagname = "img"
    }
}