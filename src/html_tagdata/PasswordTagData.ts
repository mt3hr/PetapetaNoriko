import HTMLTagDataBase from "./HTMLTagDataBase";

export default class PasswordTagData extends HTMLTagDataBase {
    name = ""
    value = ""
    size = ""
    maxlength = ""
    autocomplete = "default"
    pattern = ""
    placeholder = ""
    readonly = false
    required = false
    constructor() {
        super()
        this.tagname = "password"
    }
}