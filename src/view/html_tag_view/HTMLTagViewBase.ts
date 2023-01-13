import HTMLTagDataBase, { PositionStyle } from "@/html_tagdata/HTMLTagDataBase";
import IMGTagData from "@/html_tagdata/IMGTagData";
import { deserialize } from "@/serializable/serializable";
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator"
import { generate_tagdata_by_tagname } from "./generate_tagdata_by_tagname";
import HTMLTagView from '../HTMLTagView.vue';

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
        // if (e.dataTransfer.getData("ppmk/struct_li_id")) e.dataTransfer.dropEffect = "move"
        if (e.dataTransfer.getData("ppmk/move_tag_id")) e.dataTransfer.dropEffect = "move"
        if (e.dataTransfer.getData("ppmk/htmltag")) e.dataTransfer.dropEffect = "move"
        if (e.dataTransfer.files.length != 0) e.dataTransfer.dropEffect = "copy"
    }

    on_drop(e: DragEvent, tagdata: HTMLTagDataBase) {
        let tagid: string = null
        if (e.dataTransfer.getData("ppmk/struct_li_id")) tagid = e.dataTransfer.getData("ppmk/struct_li_id")
        if (e.dataTransfer.getData("ppmk/move_tag_id")) tagid = e.dataTransfer.getData("ppmk/move_tag_id")

        const json = JSON.stringify(this.tagdatas_root)
        const html_tagdatas_root: Array<HTMLTagDataBase> = JSON.parse(json, deserialize)

        if (e.dataTransfer.getData("ppmk/htmltag")) {
            const tagname = e.dataTransfer.getData("ppmk/htmltag")
            const tag_data: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)

            let depth = 0
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
                    depth++
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                    depth
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            depth = 0
            if (!child_appended) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (depth == 0) {
                                tag_data.position_style = PositionStyle.Absolute
                                const dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                                const dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                                tag_data.position_x = e.pageX - dropzone_x
                                tag_data.position_y = e.pageY - dropzone_y
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
                        depth++
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                        depth--
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            this.updated_html_tagdatas(html_tagdatas_root)
            this.$nextTick(() => {
                this.onclick_tag(tag_data)
            })
        } else if (tagid) {
            if (!this.can_drop(tagid, tagdata)) {
                return
            }
            let move_tagdata: HTMLTagDataBase

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

            let depth = 0
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
                    depth++
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                    depth--
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            depth = 0
            if (!child_appended) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (depth == 0) {
                                move_tagdata.position_style = PositionStyle.Absolute
                                const dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                                const dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                                move_tagdata.position_x = e.pageX - dropzone_x
                                move_tagdata.position_y = e.pageY - dropzone_y
                                move_tagdata.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                                move_tagdata.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                            } else {
                                move_tagdata.position_style = PositionStyle.None
                                move_tagdata.position_x = undefined
                                move_tagdata.position_y = undefined
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
                        depth++
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                        depth--
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            this.updated_html_tagdatas(html_tagdatas_root)
            this.$nextTick(() => {
                this.onclick_tag(move_tagdata)
            })
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                const tag_data = new IMGTagData()
                tag_data.src = event.currentTarget.result

                let depth = 0
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
                        depth++
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                        depth--
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)

                depth = 0
                if (!child_appended) {
                    walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                        for (let i = 0; i < tagdatas.length; i++) {
                            if (tagdata.tagid == tagdatas[i].tagid) {
                                if (depth == 0) {
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
                            depth++
                            if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                                return true
                            }
                            depth--
                        }
                        return false
                    }
                    walk_tagdatas(html_tagdatas_root)
                }
                this.updated_html_tagdatas(html_tagdatas_root)
                this.$nextTick(() => {
                    this.onclick_tag(tag_data)
                })
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.preventDefault()
        e.stopPropagation()
    }

    updated_html_tagdatas(html_tagdatas_root: Array<HTMLTagDataBase>) {
        this.$emit('updated_tagdatas_root', html_tagdatas_root)
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit("onclick_tag", tagdata)
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagView = HTMLTagView
    }

    updated_tagdatas_root(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_tagdatas_root", tagdatas)
    }
    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }
}