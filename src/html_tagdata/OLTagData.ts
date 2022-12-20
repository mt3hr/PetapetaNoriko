import HTMLTagDataBase from "./HTMLTagDataBase";

export default class OLTagData extends HTMLTagDataBase {
    reversed = false
    start = "1"
    constructor() {
        super()
        this.tagname = "ol"
    }
}