import HTMLTagDataBase from "./HTMLTagDataBase";

export default class H2TagData extends HTMLTagDataBase {
    text = "見出し2"
    constructor() {
        super()
        this.tagname = "h2"
    }
}