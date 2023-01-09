import HTMLTagDataBase, { PositionStyle } from "@/html_tagdata/HTMLTagDataBase";
import IMGTagData from "@/html_tagdata/IMGTagData";
import { deserialize } from "@/serializable/serializable";
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator"
import { generate_tagdata_by_tagname } from "./generate_tagdata_by_tagname";

export default class HTMLTagViewBase extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    @Prop({ require: true }) tagdatas_root: Array<HTMLTagDataBase>
    @Prop({ require: true }) clicked_tagdata: HTMLTagDataBase
    @Prop() show_border: boolean
    position_css: string
    selected_this_tag = false

    get tagdata_typed(): HTMLTagDataBase { return this.tagdata }

    created() {
        this.update_position()
    }

    @Watch('clicked_tagdata')
    update_clicked_style() {
        if (this.clicked_tagdata && this.clicked_tagdata.tagid == this.tagdata.tagid) {
            this.position_css["background-color"] = "lightsteelblue"
        } else {
            this.position_css["background-color"] = undefined
        }
    }

    @Watch('show_border')
    @Watch('tagdata')
    update_position() {
        const style: any = {}
        if (this.tagdata.position_style == PositionStyle.Absolute) {
            style.position = "absolute"
            style.left = this.tagdata.position_x + "px"
            style.top = this.tagdata.position_y + "px"
            style.scale = this.tagdata.scale
        }
        if (this.show_border) {
            style.border = "solid 2px black"
            style["background-color"] = "snow"
        }
        if (this.tagdata.selected_this_tag) {
            style.border = "solid 2px yellow"
        }
        this.position_css = style
    }

    can_drop(move_tagid: string, target_tagdata: HTMLTagDataBase): boolean {
        if (move_tagid == target_tagdata.tagid) {
            return false
        }

        let is_in_drag_tag = false
        let j = 0
        let exist_in_target = false
        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) { return }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
            for (let i = 0; i < tagdatas.length; i++) {
                if (move_tagid == tagdatas[i].tagid) {
                    is_in_drag_tag = true
                }
                if (is_in_drag_tag) j++
                if (is_in_drag_tag && tagdatas[i].tagid == target_tagdata.tagid) {
                    exist_in_target = true
                }

                walk_tagdatas(tagdatas[i].child_tagdatas)
                if (is_in_drag_tag) j--
                if (is_in_drag_tag && j == 0) {
                    is_in_drag_tag = false
                }
            }
        }
        walk_tagdatas(this.tagdatas_root)
        return !exist_in_target
    }

    on_dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/struct_li_id") || e.dataTransfer.getData("ppmk/move_tag_id") ||
            e.dataTransfer.getData("ppmk/htmltag") ||
            e.dataTransfer.items.length != 0
        ) {
            e.dataTransfer.dropEffect = "move"
        }
    }

    on_drop(e: DragEvent, tagdata: HTMLTagDataBase) {
        const tagid = e.dataTransfer.getData("ppmk/struct_li_id") ? e.dataTransfer.getData("ppmk/struct_li_id") : e.dataTransfer.getData("ppmk/move_tag_id")
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            const json = JSON.stringify(this.tagdatas_root)
            const html_tagdatas_root: Array<HTMLTagDataBase> = JSON.parse(json, deserialize)

            const tagname = e.dataTransfer.getData("ppmk/htmltag")
            const tag_data: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)

            let is_child = false
            let child_appended = false
            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag && !e.altKey) {
                            tag_data.position_style = PositionStyle.None
                            tag_data.position_x = undefined
                            tag_data.position_y = undefined
                            if (e.shiftKey) {
                                tagdatas[i].child_tagdatas.unshift(tag_data)
                            } else if (e.ctrlKey) {
                                tagdatas[i].child_tagdatas.push(tag_data)
                            } else {
                                tagdatas[i].child_tagdatas.push(tag_data)
                            }
                            child_appended = true
                            return true
                        }
                    }
                    is_child = true
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                    is_child = false
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            is_child = false
            if (!child_appended) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (!is_child) {
                                tag_data.position_style = PositionStyle.Absolute
                                const dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                                const dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                                tag_data.position_x = e.pageX - dropzone_x
                                tag_data.position_y = e.pageY - dropzone_y
                                tag_data.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                                tag_data.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                            } else {
                                tag_data.position_style = PositionStyle.None
                                tag_data.position_x = undefined
                                tag_data.position_y = undefined
                            }
                            if (e.shiftKey) {
                                tagdatas.splice(i, 0, tag_data)
                            } else if (e.ctrlKey) {
                                tagdatas.splice(i + 1, 0, tag_data)
                            } else {
                                tagdatas.splice(i + 1, 0, tag_data)
                            }
                            return true
                        }
                        is_child = true
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                        is_child = false
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            this.$emit("updated_tagdatas_root", html_tagdatas_root)
        } else if (tagid) {
            if (!this.can_drop(tagid, tagdata)) {
                return
            }
            let move_tagdata: HTMLTagDataBase

            const json = JSON.stringify(this.tagdatas_root)
            const html_tagdatas_root: Array<HTMLTagDataBase> = JSON.parse(json, deserialize)

            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagid == tagdatas[i].tagid) {
                        move_tagdata = tagdatas[i]
                        tagdatas.splice(i, 1)
                        return true
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            let is_child = false
            let child_appended = false

            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag && !e.altKey) {
                            move_tagdata.position_style = PositionStyle.None
                            move_tagdata.position_x = undefined
                            move_tagdata.position_y = undefined
                            if (e.shiftKey) {
                                tagdatas[i].child_tagdatas.splice(i, 0, move_tagdata)
                            } else if (e.ctrlKey) {
                                tagdatas[i].child_tagdatas.splice(i + 1, 0, move_tagdata)
                            } else {
                                tagdatas[i].child_tagdatas.splice(i + 1, 0, move_tagdata)
                            }
                            child_appended = true
                            return true
                        }
                    }
                    is_child = true
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                    is_child = true
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            is_child = false
            if (!child_appended) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (!is_child) {
                                move_tagdata.position_style = PositionStyle.Absolute
                                const dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                                const dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                                move_tagdata.position_x = e.pageX - dropzone_x
                                move_tagdata.position_y = e.pageY - dropzone_y
                                move_tagdata.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                                move_tagdata.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                                console.log(e.pageX)
                                console.log(e.pageY)
                            } else {
                                move_tagdata.position_style = PositionStyle.None
                                move_tagdata.position_x = undefined
                                move_tagdata.position_y = undefined
                                console.log("a")
                            }

                            if (e.shiftKey) {
                                tagdatas.splice(i, 0, move_tagdata)
                            } else if (e.ctrlKey) {
                                tagdatas.splice(i + 1, 0, move_tagdata)
                            } else {
                                tagdatas.splice(i + 1, 0, move_tagdata)
                            }
                            return true
                        }
                        is_child = true
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                        is_child = false
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            this.$emit("updated_tagdatas_root", html_tagdatas_root)
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                const tag_data = new IMGTagData()
                tag_data.src = event.currentTarget.result

                const json = JSON.stringify(this.tagdatas_root)
                const html_tagdatas_root: Array<HTMLTagDataBase> = JSON.parse(json, deserialize)

                let is_child = false
                let child_appended = false
                let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (tagdatas[i].has_child_tag && !e.altKey) {
                                tag_data.position_style = PositionStyle.None
                                tag_data.position_x = undefined
                                tag_data.position_y = undefined
                                if (e.shiftKey) {
                                    tagdatas[i].child_tagdatas.unshift(tag_data)
                                } else if (e.ctrlKey) {
                                    tagdatas[i].child_tagdatas.push(tag_data)
                                } else {
                                    tagdatas[i].child_tagdatas.push(tag_data)
                                }
                                child_appended = true
                                return true
                            }
                        }
                        is_child = true
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                        is_child = false
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)

                is_child = false
                if (!child_appended) {
                    walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                        for (let i = 0; i < tagdatas.length; i++) {
                            if (tagdata.tagid == tagdatas[i].tagid) {
                                if (!is_child) {
                                    tag_data.position_style = PositionStyle.Absolute
                                    const dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                                    const dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                                    tag_data.position_x = e.pageX - dropzone_x
                                    tag_data.position_y = e.pageY - dropzone_y
                                    tag_data.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                                    tag_data.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                                } else {
                                    tag_data.position_style = PositionStyle.None
                                    tag_data.position_x = undefined
                                    tag_data.position_y = undefined
                                }
                                if (e.shiftKey) {
                                    tagdatas.splice(i, 0, tag_data)
                                } else if (e.ctrlKey) {
                                    tagdatas.splice(i + 1, 0, tag_data)
                                } else {
                                    tagdatas.splice(i + 1, 0, tag_data)
                                }
                                return true
                            }
                            is_child = true
                            if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                                return true
                            }
                            is_child = false
                        }
                        return false
                    }
                    walk_tagdatas(html_tagdatas_root)
                }
                this.$emit("updated_tagdatas_root", html_tagdatas_root)
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.stopPropagation()
    }
}