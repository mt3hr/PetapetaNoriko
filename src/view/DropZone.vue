<template>
    <div>
        <component :is="'style'">
            {{ style_user_edited_fixed }}
        </component>
        <h2 v-if="editor_mode"><font color="#4682b4">ドロップゾーン</font></h2>
        <h2 v-else>画面</h2>
        <div id="dropzone" class="dropzone" @click="onclick" @drop.stop.prevent="on_drop"
            @dragover.prevent="on_dragover" :style="dropzone_style" @contextmenu="show_contextmenu">

            <body id="dropzone_body" class="page" :style="dropzone_style">
                <div v-if="html_tagdatas == null"
                    :style="{ 'text-align': 'center', 'vertical-align': 'middle', 'height': '-webkit-fill-available' }">
                    <v-btn color="primary" @click="add_page"
                        :style="{ 'margin': 'auto', 'position': 'rerative', 'top': '45%' }">ページを追加</v-btn>
                </div>
                <HTMLTagView v-for="tagdata, index in html_tagdatas" :key="index" :tagdatas_root="html_tagdatas"
                    :editor_mode="editor_mode" :clicked_tagdata="clicked_tagdata" :show_border="show_border"
                    :tagdata="tagdata" :copied_tagdata="copied_tagdata" @updated_tagdatas_root="updated_tagdatas_root"
                    @copy_tag="copy_tag" @updated_tagdata="updated_tagdata" @onclick_tag="onclick_tag"
                    @delete_tagdata="delete_tagdata" />
            </body>
        </div>
        <v-menu v-if="is_show_contextmenu" v-model="is_show_contextmenu" :style="contextmenu_style">
            <v-list v-if="copied_tagdata.tagname != 'tagbase'">
                <v-list-item v-if="copied_tagdata.tagname != 'tagbase'" @click="paste_tag">貼り付け</v-list-item>
            </v-list>
        </v-menu>
        <div
            v-if="is_show_table_initialize_dialog || is_show_ol_initialize_dialog || is_show_ul_initialize_dialog || is_show_img_initialize_dialog">
            <v-dialog v-model="is_show_table_initialize_dialog" class="init_dialog">
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
                            <v-btn color="primary" @click="is_show_table_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn color="primary" @click="initialize_table">作成</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
            <v-dialog v-model="is_show_ul_initialize_dialog" class="init_dialog">
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
                            <v-btn color="primary" @click="is_show_ul_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn color="primary" @click="initialize_ul">作成</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
            <v-dialog v-model="is_show_ol_initialize_dialog" class="init_dialog">
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
                            <v-btn color="primary" @click="is_show_ol_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn color="primary" @click="initialize_ol">作成</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
            <v-dialog v-model="is_show_img_initialize_dialog" class="init_dialog">
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
                            <v-btn color="primary" @click="is_show_img_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn color="primary" @click="initialize_img">作成</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase'
import HTMLTagView from '@/view/HTMLTagView.vue'
import IMGTagData from '@/html_tagdata/IMGTagData'
import { Prop, Watch } from 'vue-property-decorator'
import { deserialize } from '@/serializable/serializable'
import { generate_tagdata_by_tagname } from './html_tag_view/generate_tagdata_by_tagname'
import generateUUID from '@/uuid'
import TableTagData from '@/html_tagdata/TableTagData'
import TRTagData from '@/html_tagdata/TRTagData'
import TDTagData from '@/html_tagdata/TDTagData'
import ULTagData from '@/html_tagdata/ULTagData'
import OLTagData from '@/html_tagdata/OLTagData'
import LITagData from '@/html_tagdata/LITagData'

@Options({
    components: {
        HTMLTagView,
    }
})

export default class DropZone extends Vue {
    html_tagdatas = new Array<HTMLTagDataBase>()
    style_user_edited = ""
    @Prop() show_border: boolean
    @Prop() dropzone_style: any
    @Prop() clicked_tagdata: HTMLTagDataBase
    @Prop() copied_tagdata: HTMLTagDataBase
    @Prop() editor_mode: boolean

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
            let copied_tagdata = this.copied_tagdata.clone()
            copied_tagdata.tagid = "id_" + generateUUID()
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
            this.html_tagdatas.push(copied_tagdata)
        }
        this.updated_tagdatas_root(this.html_tagdatas)
    }

    get contextmenu_style(): any {
        return {
            display: "inline",
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }

    // https://stackoverflow.com/questions/3326494/parsing-css-in-javascript-jquery
    rulesForCssText(styleContent) {
        let doc = document.implementation.createHTMLDocument(""),
            styleElement = document.createElement("style");
        styleElement.textContent = styleContent;
        doc.body.appendChild(styleElement);
        return styleElement.sheet.cssRules;
    }

    get style_user_edited_fixed(): string {
        try {
            let style = ""
            let css_rules: any = this.rulesForCssText(this.style_user_edited)
            for (let i = 0; i < css_rules.length; i++) {
                let css_element = css_rules[i]
                let css_text = css_element.cssText
                let css_text_spl = css_text.split("{")
                let target = css_text_spl[0]
                let rules = "{" + css_text_spl[1]

                let targets = target.split(",")
                for (let j = 0; j < targets.length; j++) {
                    targets[j] = "#dropzone " + targets[j]
                }
                target = targets.join(",")

                style += target + rules + "\n"
            }
            return style
        } catch (error) {
            console.log(error)
            return ""
        }
    }

    on_dragover(e: DragEvent) {
        if (!this.editor_mode) {
            e.dataTransfer.dropEffect = 'none'
            return
        }
        if (!this.html_tagdatas) {
            e.dataTransfer.dropEffect = 'none'
            return
        }
        if (e.dataTransfer.getData("ppmk/struct_li_id") || e.dataTransfer.getData("ppmk/move_tag_id") ||
            e.dataTransfer.getData("ppmk/htmltag") ||
            e.dataTransfer.items.length != 0
        ) {
            e.dataTransfer.dropEffect = "move"
        } else {
            e.dataTransfer.dropEffect = "none"
        }
    }

    on_drop(e: DragEvent) {
        let tagid: string = null
        if (e.dataTransfer.getData("ppmk/struct_li_id")) tagid = e.dataTransfer.getData("ppmk/struct_li_id")
        if (e.dataTransfer.getData("ppmk/move_tag_id")) tagid = e.dataTransfer.getData("ppmk/move_tag_id")

        if (e.dataTransfer.getData("ppmk/htmltag")) {
            let tagname = e.dataTransfer.getData("ppmk/htmltag")
            let tag_data: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)
            tag_data.position_x = e.offsetX
            tag_data.position_y = e.offsetY


            let html_tagdatas = new Array<HTMLTagDataBase>()
            this.html_tagdatas.forEach((child_tagdata) => { html_tagdatas.push(child_tagdata.clone()) })
            html_tagdatas.push(tag_data)
            this.$emit('updated_htmltagdatas', html_tagdatas, null, true)
            this.$nextTick(() => {
                this.onclick_tag(tag_data)
            })

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
        } else if (tagid) {
            // すでに配置されたコンポーネントの移動
            let html_tagdatas_root = new Array<HTMLTagDataBase>()
            this.html_tagdatas.forEach((child_tagdata) => { html_tagdatas_root.push(child_tagdata.clone()) })
            let move_tagdata: HTMLTagDataBase

            let move_in_root = false
            let dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
            let dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
            for (let i = 0; i < html_tagdatas_root.length && move_in_root; i++) {
                if (html_tagdatas_root[i].tagid == tagid) {
                    move_tagdata = html_tagdatas_root[i]
                    move_tagdata.position_style = PositionStyle.Absolute
                    move_tagdata.position_x = e.pageX - dropzone_x
                    move_tagdata.position_y = e.pageY - dropzone_y
                    move_tagdata.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                    move_tagdata.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                    move_in_root = true
                }
                this.$emit('updated_htmltagdatas', html_tagdatas_root, null, true)
                this.$nextTick(() => {
                    this.onclick_tag(move_tagdata)
                })
                e.stopPropagation()
            }
            if (move_in_root) return

            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    let html_tagdata = tagdatas[i]
                    if (tagid == tagdatas[i].tagid) {
                        move_tagdata = tagdatas[i]
                        move_tagdata.position_style = PositionStyle.Absolute
                        tagdatas.splice(i, 1)
                        let dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                        let dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                        html_tagdata.position_x = e.pageX - dropzone_x
                        html_tagdata.position_y = e.pageY - dropzone_y
                        if (e.dataTransfer.getData("ppmk/move_tag_offset_x")) html_tagdata.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                        if (e.dataTransfer.getData("ppmk/move_tag_offset_y")) html_tagdata.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                        return true
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
            if (e.shiftKey) {
                html_tagdatas_root.unshift(move_tagdata)
            } else if (e.ctrlKey) {
                html_tagdatas_root.push(move_tagdata)
            } else {
                html_tagdatas_root.unshift(move_tagdata)
            }

            this.$emit('updated_htmltagdatas', html_tagdatas_root, null, true)
            this.$nextTick(() => {
                this.onclick_tag(move_tagdata)
            })
            e.stopPropagation()
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                let tag_data = new IMGTagData()
                tag_data.src = event.currentTarget.result
                tag_data.position_x = e.offsetX
                tag_data.position_y = e.offsetY
                this.html_tagdatas.push(tag_data)
                this.updated_tagdata(tag_data)
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.stopPropagation()
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit('onclick_tag', tagdata)
    }

    updated_tagdata(tagdata: HTMLTagDataBase) {
        let html_tagdatas_root = new Array<HTMLTagDataBase>()
        this.html_tagdatas.forEach((child_tagdata) => { html_tagdatas_root.push(child_tagdata.clone()) })

        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                if (tagdata.tagid == tagdatas[i].tagid) {
                    tagdatas[i] = tagdata
                    return true
                }
                if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                    return true
                }
            }
        }
        walk_tagdatas(html_tagdatas_root)
        this.html_tagdatas = new Array<HTMLTagDataBase>()
        this.html_tagdatas = html_tagdatas_root
        this.$emit('updated_htmltagdatas', html_tagdatas_root, tagdata, true)
    }

    delete_tagdata(tagdata: HTMLTagDataBase) {
        let html_tagdatas_root = new Array<HTMLTagDataBase>()
        this.html_tagdatas.forEach((child_tagdata) => { html_tagdatas_root.push(child_tagdata.clone()) })

        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                if (tagdata.tagid == tagdatas[i].tagid) {
                    tagdatas.splice(i, 1)
                    return true
                }
                if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                    return true
                }
            }
        }
        walk_tagdatas(html_tagdatas_root)
        this.$emit('updated_htmltagdatas', html_tagdatas_root, null, true)
    }

    updated_tagdatas_root(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit('updated_tagdatas_root', tagdatas, null, true)
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }

    show_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    onclick() {
        this.$emit('onclick_tag', null)
    }

    add_page() {
        this.$emit('add_page')
    }

    initialize_table() {
        this.is_show_table_initialize_dialog = false
        for (let i = 0; i < this.table_rows; i++) {
            let tr_tagdata = new TRTagData()
            tr_tagdata.position_style = PositionStyle.None
            for (let j = 0; j < this.table_cols; j++) {
                let td_tagdata = new TDTagData();
                td_tagdata.position_style = PositionStyle.None
                tr_tagdata.child_tagdatas.push(td_tagdata)
            }
            this.table_initialize_target.child_tagdatas.push(tr_tagdata)
        }
        this.updated_tagdata(this.table_initialize_target)
        this.table_rows = 1
        this.table_cols = 1
        this.table_initialize_target = null
    }

    initialize_ul() {
        this.is_show_ul_initialize_dialog = false
        for (let i = 0; i < this.ul_items; i++) {
            let li_tagdata = new LITagData()
            li_tagdata.position_style = PositionStyle.None
            this.ul_initialize_target.child_tagdatas.push(li_tagdata)
        }
        this.updated_tagdata(this.ul_initialize_target)
        this.ul_items = 1
        this.ul_initialize_target = null
    }

    initialize_ol() {
        this.ol_initialize_target.start = "1"
        this.is_show_ol_initialize_dialog = false
        for (let i = 0; i < this.ol_items; i++) {
            let li_tagdata = new LITagData()
            li_tagdata.value = String(i + 1)
            li_tagdata.position_style = PositionStyle.None
            this.ol_initialize_target.child_tagdatas.push(li_tagdata)
        }
        this.updated_tagdata(this.ol_initialize_target)
        this.ol_items = 1
        this.ol_initialize_target = null
    }

    initialize_img() {
        this.is_show_img_initialize_dialog = false
        this.img_initialize_target.src = this.img_src
        this.updated_tagdata(this.img_initialize_target)
        this.img_src = ""
        this.img_initialize_target = null
    }

    cut_tag(tagdata: HTMLTagDataBase) {
        this.copy_tag(tagdata)
        this.delete_tagdata(tagdata)
    }
    mounted(): void {
        this.html_tagdatas = null
        this.$emit('updated_htmltagdatas', this.html_tagdatas, null, true)
    }
}
</script>
<style scoped>
.dropzone {
    overflow: hidden;
    position: relative;
}

body {
    overflow-y: hidden !important;
}

.init_dialog {
    width: 280px;
}
</style>