import HTMLTagDataBase, { PositionStyle } from "@/html_tagdata/HTMLTagDataBase";
import IMGTagData from "@/html_tagdata/IMGTagData";
import { deserialize } from "@/serializable/serializable";
import { Options, Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator"
import { generate_tagdata_by_tagname } from "./generate_tagdata_by_tagname";
import HTMLTagView from '../HTMLTagView.vue';
import TableTagData from '@/html_tagdata/TableTagData';
import ULTagData from '@/html_tagdata/ULTagData';
import OLTagData from '@/html_tagdata/OLTagData';
import generateUUID from '@/uuid';
import TRTagData from '@/html_tagdata/TRTagData';
import TDTagData from '@/html_tagdata/TDTagData';
import LITagData from '@/html_tagdata/LITagData';

export default class HTMLTagViewBase extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    @Prop({ require: true }) tagdatas_root: Array<HTMLTagDataBase>
    @Prop({ require: true }) clicked_tagdata: HTMLTagDataBase
    @Prop() show_border: boolean
    @Prop() copied_tagdata: HTMLTagDataBase
    @Prop() editor_mode: boolean
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
        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                if (move_tagid == tagdatas[i].tagid) {
                    is_in_drag_tag = true
                }
                if (is_in_drag_tag) j++
                if (is_in_drag_tag && tagdatas[i].tagid == target_tagdata.tagid) {
                    exist_in_target = true
                    return true
                }

                if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                    return true
                }
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
        if (e.dataTransfer.getData("ppmk/struct_li_id")) e.dataTransfer.dropEffect = "move"
        else if (e.dataTransfer.getData("ppmk/move_tag_id")) e.dataTransfer.dropEffect = "move"
        else if (e.dataTransfer.getData("ppmk/htmltag")) e.dataTransfer.dropEffect = "move"
        else if (e.dataTransfer.files.length != 0) e.dataTransfer.dropEffect = "copy"
        // else e.dataTransfer.dropEffect = "none"
    }

    on_drop(e: DragEvent, tagdata: HTMLTagDataBase) {
        let tagid: string = null
        if (e.dataTransfer.getData("ppmk/struct_li_id")) tagid = e.dataTransfer.getData("ppmk/struct_li_id")
        if (e.dataTransfer.getData("ppmk/move_tag_id")) tagid = e.dataTransfer.getData("ppmk/move_tag_id")

        const html_tagdatas_root = new Array<HTMLTagDataBase>()
        this.tagdatas_root.forEach((child_tagdata) => { html_tagdatas_root.push(child_tagdata.clone()) })

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
            switch (tagname) {
                case "table": {
                    this.table_rows = 1
                    this.table_cols = 1
                    this.table_initialize_target = tag_data as TableTagData
                    this.is_show_table_initialize_dialog = true
                    break
                }
                case "ul": {
                    this.ul_items = 1
                    this.ul_initialize_target = tag_data as ULTagData
                    this.is_show_ul_initialize_dialog = true
                    break
                }
                case "ol": {
                    this.ol_items = 1
                    this.ol_initialize_target = tag_data as OLTagData
                    this.is_show_ol_initialize_dialog = true
                    break
                }
                case "img": {
                    this.img_src = ""
                    this.img_initialize_target = tag_data as IMGTagData
                    this.is_show_img_initialize_dialog = true
                    break
                }
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
        this.$options.components = {}
        this.$options.components.HTMLTagView = HTMLTagView
    }

    updated_tagdatas_root(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_tagdatas_root", tagdatas)
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }

    delete_tag(tagdata: HTMLTagDataBase) {
        this.$emit("delete_tag", tagdata)
    }

    is_show_contextmenu = false
    x_contextmenu = 0
    y_contextmenu = 0

    is_show_table_initialize_dialog = false
    table_initialize_target: TableTagData = null
    table_rows = 1
    table_cols = 1

    is_show_ul_initialize_dialog = false
    ul_initialize_target: ULTagData = null
    ul_items = 1

    is_show_ol_initialize_dialog = false
    ol_initialize_target: OLTagData = null
    ol_items = 1

    is_show_img_initialize_dialog = false
    img_initialize_target: IMGTagData = null
    img_src = ""

    paste_tag() {
        if (this.copied_tagdata.tagname != 'tagbase') {
            const copied_tagdata = this.copied_tagdata.clone()
            copied_tagdata.tagid = "id_" + generateUUID()
            copied_tagdata.position_style = PositionStyle.None
            copied_tagdata.position_x = undefined
            copied_tagdata.position_y = undefined
            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
                // 後で代入する
            }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
                for (let i = 0; i < tagdatas.length; i++) {
                    tagdatas[i].tagid = "id_" + generateUUID()
                    walk_tagdatas(tagdatas[i].child_tagdatas)
                }
            }
            walk_tagdatas(copied_tagdata.child_tagdatas)
            const tagdata_typed = this.tagdata_typed.clone()
            tagdata_typed.child_tagdatas.push(copied_tagdata)
            this.updated_child_tagdata(tagdata_typed)
        }
    }

    get contextmenu_style(): any {
        return {
            display: "inline",
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }

    show_contextmenu(e: MouseEvent) {
        if (!this.editor_mode) return
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    initialize_table() {
        this.is_show_table_initialize_dialog = false
        for (let i = 0; i < this.table_rows; i++) {
            const tr_tagdata = new TRTagData()
            tr_tagdata.position_style = PositionStyle.None
            for (let j = 0; j < this.table_cols; j++) {
                const td_tagdata = new TDTagData();
                td_tagdata.position_style = PositionStyle.None
                tr_tagdata.child_tagdatas.push(td_tagdata)
            }
            this.table_initialize_target.child_tagdatas.push(tr_tagdata)
        }
        this.updated_child_tagdata(this.table_initialize_target)
        this.table_rows = 1
        this.table_cols = 1
        this.table_initialize_target = null
    }

    initialize_ul() {
        this.is_show_ul_initialize_dialog = false
        for (let i = 0; i < this.ul_items; i++) {
            const li_tagdata = new LITagData()
            li_tagdata.position_style = PositionStyle.None
            this.ul_initialize_target.child_tagdatas.push(li_tagdata)
        }
        this.updated_child_tagdata(this.ul_initialize_target)
        this.ul_items = 1
        this.ul_initialize_target = null
    }

    initialize_ol() {
        this.ol_initialize_target.start = "1"
        this.is_show_ol_initialize_dialog = false
        for (let i = 0; i < this.ol_items; i++) {
            const li_tagdata = new LITagData()
            li_tagdata.value = String(i + 1)
            li_tagdata.position_style = PositionStyle.None
            this.ol_initialize_target.child_tagdatas.push(li_tagdata)
        }
        this.updated_child_tagdata(this.ol_initialize_target)
        this.ol_items = 1
        this.ol_initialize_target = null
    }

    initialize_img() {
        this.is_show_img_initialize_dialog = false
        this.img_initialize_target.src = this.img_src
        this.updated_child_tagdata(this.img_initialize_target)
        this.img_src = ""
        this.img_initialize_target = null
    }

    updated_child_tagdata(tagdata: HTMLTagDataBase) {
        const tagdata_typed = this.tagdata_typed.clone()
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                tagdata_typed.child_tagdatas[i] = tagdata
                break
            }
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }

    delete_child_tagdata(html_tagdata: HTMLTagDataBase) {
        const tagdata_typed = this.tagdata_typed.clone()
        let index = -1
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (html_tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                index = i
                break
            }
        }
        if (index != -1) {
            tagdata_typed.child_tagdatas.splice(index, 1)
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }
}