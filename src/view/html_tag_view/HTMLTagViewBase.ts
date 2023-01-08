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

    @Watch('show_border')
    @Watch('tagdata')
    @Watch('clicked_tagdata')
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
        if (this.clicked_tagdata.tagid == this.tagdata.tagid) {
            style["background-color"] = "lightsteelblue";
        }
        this.position_css = style
    }

    can_drop(move_tagid: string, target_tagdata: HTMLTagDataBase): boolean {
        if (move_tagid == target_tagdata.tagid) {
            return false
        }

        let is_in_drag_tag = false
        let is_in_target_tag = false
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
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
            for (let i = 0; i < tagdatas.length; i++) {
                if (target_tagdata.tagid == tagdatas[i].tagid) {
                    is_in_target_tag = true
                }
                if (is_in_target_tag) j++
                if (is_in_target_tag && tagdatas[i].tagid == move_tagid) {
                    exist_in_target = true
                }

                walk_tagdatas(tagdatas[i].child_tagdatas)
                if (is_in_target_tag) j--
                if (is_in_target_tag && j == 0) {
                    is_in_target_tag = false
                }
            }
        }
        // walk_tagdatas(this.tagdatas_root)
        return !exist_in_target
    }

    on_dragover(e: DragEvent) {
        const tagname = e.dataTransfer.getData("ppmk/htmltag")
        if (tagname) {
            e.dataTransfer.dropEffect = "copy"
        }
    }

    on_drop(e: DragEvent) {
        const tagid = e.dataTransfer.getData("ppmk/struct_li_id") ? e.dataTransfer.getData("ppmk/struct_li_id") : e.dataTransfer.getData("ppmk/move_tag_id")
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            let json = JSON.stringify(this.tagdatas_root)
            const html_tagdatas_root = JSON.parse(json, deserialize)
            json = JSON.stringify(this.tagdata_typed)
            const tagdata_typed = JSON.parse(json, deserialize)
            const tagname = e.dataTransfer.getData("ppmk/htmltag")
            const tagdata: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)

            let is_child = false
            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata_typed.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag) {
                            tagdata.position_style = PositionStyle.None
                            tagdata.position_x = undefined
                            tagdata.position_y = undefined
                        } else {
                            tagdata.position_style = PositionStyle.Absolute
                            tagdata.position_x = e.clientX
                            tagdata.position_y = e.clientY
                        }
                        if (tagdatas[i].has_child_tag && e.altKey) {
                            if (e.shiftKey) {
                                tagdatas.splice(i, 0, tagdata)
                            } else if (e.ctrlKey) {
                                tagdatas.splice(i + 1, 0, tagdata)
                            } else {
                                tagdatas.splice(i + 1, 0, tagdata)
                            }
                        } else {
                            if (e.shiftKey) {
                                tagdatas[i].child_tagdatas.unshift(tagdata)
                            } else if (e.ctrlKey) {
                                tagdatas[i].child_tagdatas.push(tagdata)
                            } else {
                                tagdatas[i].child_tagdatas.push(tagdata)
                            }
                        }
                        return true
                    }
                    is_child = true
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
            this.$emit("updated_tagdatas_root", html_tagdatas_root)
        } else if (tagid) {
            if (!this.can_drop(tagid, this.tagdata_typed)) {
                return
            }
            const json = JSON.stringify(this.tagdatas_root)
            const html_tagdatas_root = JSON.parse(json, deserialize)
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

            const tagdata_typed = this.tagdata_typed
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata_typed.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag) {
                            move_tagdata.position_style = PositionStyle.None
                            move_tagdata.position_x = undefined
                            move_tagdata.position_y = undefined
                            if (tagdatas[i].has_child_tag && e.altKey) {
                                if (e.shiftKey) {
                                    tagdatas.splice(i, 0, move_tagdata)
                                } else if (e.ctrlKey) {
                                    tagdatas.splice(i + 1, 0, move_tagdata)
                                } else {
                                    tagdatas.splice(i + 1, 0, move_tagdata)
                                }
                            } else {
                                if (e.shiftKey) {
                                    tagdatas[i].child_tagdatas.unshift(move_tagdata)
                                } else if (e.ctrlKey) {
                                    tagdatas[i].child_tagdatas.push(move_tagdata)
                                } else {
                                    tagdatas[i].child_tagdatas.push(move_tagdata)
                                }
                            }


                            return true
                        }
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
            this.$emit("updated_tagdatas_root", html_tagdatas_root)
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                const tagdata_typed = this.tagdata_typed
                const tag_data = new IMGTagData()
                tag_data.position_style = PositionStyle.None
                tag_data.src = event.currentTarget.result
                tagdata_typed.child_tagdatas.push(tag_data)
                this.$emit('updated_tagdata', tagdata_typed)
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.stopPropagation()
    }
}