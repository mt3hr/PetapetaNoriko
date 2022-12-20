import HTMLTagDataBase from "./HTMLTagDataBase";

export default class PTagData extends HTMLTagDataBase {
    text = "段落"
    constructor() {
        super()
        this.tagname = "p"
    }
}