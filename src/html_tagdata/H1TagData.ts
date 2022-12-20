import HTMLTagDataBase from "./HTMLTagDataBase";

export default class H1TagData extends HTMLTagDataBase {
    text = "見出し1"
    constructor() {
        super()
        this.tagname = "h1"
    }
}