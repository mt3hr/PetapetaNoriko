<template>
    <li ref="li" class="tag_struct_li" draggable="true" dropzone="true" @drop.prevent.stop="(e) => drop(e, tagdata)"
        @contextmenu.stop="show_contextmenu" @dragstart.stop="(e) => dragstart(e, tagdata)"
        @click.stop="() => onclick_tag(tagdata)" @dragover.prevent="dragover" :style="style">
        <span>{{ tagdata.tagname }}:</span>
        <span>({{ tagdata.to_string() }})</span>
        <ul v-if="tagdata.child_tagdatas.length != 0">
            <HTMLTagStructViewLi v-for="child_tagdata, index in tagdata.child_tagdatas" :key="index"
                @updated_tagdata="updated_tagdata" :copied_tagdata="copied_tagdata"
                :auto_scroll_tag_struct_view="auto_scroll_tag_struct_view" :clicked_tagdata="clicked_tagdata"
                @copy_tag="copy_tag" :html_tagdatas_root="html_tagdatas_root" :tagdata="child_tagdata"
                @onclick_tag="onclick_tag" @delete_tagdata="delete_tag"
                @updated_html_tagdatas="(tagdatas) => updated_html_tagdatas_child(tagdatas)" />
        </ul>
        <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
            <v-list>
                <v-list-item @click="copy_tag(tagdata)">コピー</v-list-item>
                <v-list-item v-if="copied_tagdata.tagname != 'tagbase' && tagdata.has_child_tag"
                    @click="paste_tag_to_child">貼り付け</v-list-item>
                <v-list-item @click="delete_tag(tagdata)">削除</v-list-item>
            </v-list>
        </v-menu>
        <v-dialog v-model="is_show_table_initialize_dialog">
            <v-card class="pa-5">
                <v-card-title>
                    <v-row>
                        <v-col cols="auto">
                            Table初期化
                        </v-col>
                        <v-spacer />
                    </v-row>
                </v-card-title>
                <v-row>
                    <v-col cols="auto">行数</v-col>
                    <v-col cols="auto"><input @keypress.enter="initialize_table" type="number" v-model="table_rows"
                            default="1" /></v-col>
                </v-row>
                <v-row>
                    <v-col cols="auto">列数</v-col>
                    <v-col cols="auto"><input @keypress.enter="initialize_table" type="number" v-model="table_cols"
                            default="1" /></v-col>
                </v-row>
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_table_initialize_dialog = false">閉じる</v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-btn @click="initialize_table">作成</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="is_show_ul_initialize_dialog">
            <v-card class="pa-5">
                <v-card-title>
                    <v-row>
                        <v-col cols="auto">
                            UL初期化
                        </v-col>
                        <v-spacer />
                    </v-row>
                </v-card-title>
                <v-row>
                    <v-col cols="auto">アイテム数</v-col>
                    <v-col cols="auto"><input @keypress.enter="initialize_ul" type="number" v-model="ul_items"
                            default="1" /></v-col>
                </v-row>
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_ul_initialize_dialog = false">閉じる</v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-btn @click="initialize_ul">作成</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="is_show_ol_initialize_dialog">
            <v-card class="pa-5">
                <v-card-title>
                    <v-row>
                        <v-col cols="auto">
                            OL初期化
                        </v-col>
                        <v-spacer />
                    </v-row>
                </v-card-title>
                <v-row>
                    <v-col cols="auto">アイテム数</v-col>
                    <v-col cols="auto"><input @keypress.enter="initialize_ol" type="number" v-model="ol_items"
                            default="1" /></v-col>
                </v-row>
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_ol_initialize_dialog = false">閉じる</v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-btn @click="initialize_ol">作成</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="is_show_img_initialize_dialog">
            <v-card class="pa-5">
                <v-card-title>
                    <v-row>
                        <v-col cols="auto">
                            IMG初期化
                        </v-col>
                        <v-spacer />
                    </v-row>
                </v-card-title>
                <v-row>
                    <v-col cols="auto">URL</v-col>
                    <v-col cols="auto"><input @keypress.enter="initialize_img" type="url" v-model="img_src"
                            default="1" /></v-col>
                </v-row>
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_img_initialize_dialog = false">閉じる</v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-btn @click="initialize_img">作成</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </li>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import HTMLTagStructViewLi_ref from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';
import { generate_tagdata_by_tagname } from './html_tag_view/generate_tagdata_by_tagname';
import IMGTagData from '@/html_tagdata/IMGTagData';
import generateUUID from '@/uuid';
import TableTagData from '@/html_tagdata/TableTagData';
import ULTagData from '@/html_tagdata/ULTagData';
import OLTagData from '@/html_tagdata/OLTagData';
import LITagData from '@/html_tagdata/LITagData';
import TRTagData from '@/html_tagdata/TRTagData';
import TDTagData from '@/html_tagdata/TDTagData';

@Options({
    components: {
        HTMLTagStructViewLi_ref,
    }
})

export default class HTMLTagPropertyView extends Vue {
    @Prop() html_tagdatas_root: Array<HTMLTagDataBase>
    @Prop() tagdata: HTMLTagDataBase
    @Prop() clicked_tagdata: HTMLTagDataBase
    @Prop() auto_scroll_tag_struct_view: boolean
    @Prop() copied_tagdata: HTMLTagDataBase

    style: any = {}

    @Watch('clicked_tagdata')
    update_style() {
        if (this.clicked_tagdata && this.tagdata.tagid == this.clicked_tagdata.tagid) {
            if (this.auto_scroll_tag_struct_view) {
                const el = this.$refs['li'] as HTMLElement;
                el?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
            }
            this.style = {
                "background-color": "lightsteelblue",
            }
            return
        }
        this.style = {}
    }

    dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/struct_li_id")) e.dataTransfer.dropEffect = "move"
        // if (e.dataTransfer.getData("ppmk/move_tag_id")) e.dataTransfer.dropEffect = "move"
        if (e.dataTransfer.getData("ppmk/htmltag")) e.dataTransfer.dropEffect = "move"
        if (e.dataTransfer.files.length != 0) e.dataTransfer.dropEffect = "copy"
    }
    can_drop(move_tagid: string, target_tagdata: HTMLTagDataBase): boolean {
        if (move_tagid == target_tagdata.tagid) {
            return false
        }

        let is_in_drag_tag = false
        let j = 0
        let exist_in_target = false
        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return }
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
        walk_tagdatas(this.html_tagdatas_root)
        return !exist_in_target
    }

    drop(e: DragEvent, tagdata: HTMLTagDataBase) {
        let tagid: string = null
        if (e.dataTransfer.getData("ppmk/struct_li_id")) tagid = e.dataTransfer.getData("ppmk/struct_li_id")
        if (e.dataTransfer.getData("ppmk/move_tag_id")) tagid = e.dataTransfer.getData("ppmk/move_tag_id")

        const json = JSON.stringify(this.html_tagdatas_root)
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
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.preventDefault()
        e.stopPropagation()
    }

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas)
    }

    updated_html_tagdatas_child(tagdatas: any) {
        this.$emit("updated_html_tagdatas", tagdatas)
    }

    dragstart(e: DragEvent, tagdata: HTMLTagDataBase): void {
        e.dataTransfer.setData("ppmk/struct_li_id", tagdata.tagid)
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagStructViewLi = HTMLTagStructViewLi_ref
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit('onclick_tag', tagdata)
    }

    delete_tag(tagdata: HTMLTagDataBase) {
        this.$emit("delete_tagdata", tagdata)
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }

    paste_tag_to_child(e) {
        if (this.copied_tagdata.tagname != 'tagbase') {
            const copied_tagdata: HTMLTagDataBase = JSON.parse(JSON.stringify(this.copied_tagdata), deserialize)
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
            const tagdata_typed: HTMLTagDataBase = JSON.parse(JSON.stringify(this.tagdata), deserialize)

            if (e.shiftKey) {
                tagdata_typed.child_tagdatas.unshift(copied_tagdata)
            } else if (e.ctrlKey) {
                tagdata_typed.child_tagdatas.push(copied_tagdata)
            } else {
                tagdata_typed.child_tagdatas.push(copied_tagdata)
            }

            this.updated_tagdata(tagdata_typed)
        }
    }
    updated_tagdata(tagdata: HTMLTagDataBase) {
        this.$emit('updated_tagdata', tagdata)
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
            const copied_tagdata: HTMLTagDataBase = JSON.parse(JSON.stringify(this.copied_tagdata), deserialize)
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
            const tagdata_typed = JSON.parse(JSON.stringify(this.tagdata), deserialize)
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
        const json = JSON.stringify(this.tagdata)
        const tagdata_typed: any = JSON.parse(json, deserialize)
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                tagdata_typed.child_tagdatas[i] = tagdata
                break
            }
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }

    delete_child_tagdata(html_tagdata: HTMLTagDataBase) {
        const json = JSON.stringify(this.tagdata)
        const tagdata_typed = JSON.parse(json, deserialize)
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
</script>
<style scoped>
li {
    margin-left: 20px;
}

.tag_struct_li {
    width: max-content;
}
</style>