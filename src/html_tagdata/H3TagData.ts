import HTMLTagDataBase from "./HTMLTagDataBase";

export default class H3TagData extends HTMLTagDataBase {
    text = "見出し3"
    constructor() {
        super()
        this.tagname = "h3"
    }
}