<template>
    <div class="mainside" dropzone="true" @drop.stop="drop" @dragover.prevent="dragover">
        <h2>構造</h2>
        <div class="struct_view">
            <ul class="dropzone_wrap">
                <HTMLTagStructViewLi v-for="tagdata, index in html_tagdatas" :key="index" @onclick_tag="onclick_tag"
                    @updated_tagdata="updated_tagdata" :copied_tagdata="copied_tagdata"
                    :auto_scroll_tag_struct_view="auto_scroll_tag_struct_view" :clicked_tagdata="clicked_tagdata"
                    @copy_tag="copy_tag" @delete_tagdata="delete_tag" :tagdata="tagdata"
                    :html_tagdatas_root="html_tagdatas" @updated_html_tagdatas="updated_html_tagdatas" />
            </ul>
        </div>
        <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
            <v-list>
                <v-list-item v-if="copied_tagdata.tagname != 'tagbase'" @click="paste_tag">貼り付け</v-list-item>
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

    </div>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import HTMLTagStructViewLi from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';
import { Prop, Watch } from 'vue-property-decorator';
import TableTagData from '@/html_tagdata/TableTagData';
import ULTagData from '@/html_tagdata/ULTagData';
import OLTagData from '@/html_tagdata/OLTagData';
import IMGTagData from '@/html_tagdata/IMGTagData';
import generateUUID from '@/uuid';
import TRTagData from '@/html_tagdata/TRTagData';
import TDTagData from '@/html_tagdata/TDTagData';
import LITagData from '@/html_tagdata/LITagData';
import { generate_tagdata_by_tagname } from './html_tag_view/generate_tagdata_by_tagname';

@Options({
    components: {
        HTMLTagStructViewLi,
    }
})
export default class HTMLTagPropertyView extends Vue {
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
    @Prop() clicked_tagdata: HTMLTagDataBase
    @Prop() auto_scroll_tag_struct_view: boolean
    @Prop() copied_tagdata: HTMLTagDataBase

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas, null, true)
    }

    drop(e: DragEvent) {
        let move_tagdata: HTMLTagDataBase

        let html_tagdatas = new Array<HTMLTagDataBase>()
        this.html_tagdatas.forEach((child_tagdata) => { html_tagdatas.push(child_tagdata.clone()) })

        let tagid: string = null
        if (e.dataTransfer.getData("ppmk/struct_li_id")) tagid = e.dataTransfer.getData("ppmk/struct_li_id")
        if (e.dataTransfer.getData("ppmk/move_tag_id")) tagid = e.dataTransfer.getData("ppmk/move_tag_id")

        if (e.dataTransfer.getData("ppmk/htmltag")) {
            const tagname = e.dataTransfer.getData("ppmk/htmltag")
            const tagdata: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)

            if (e.shiftKey) {
                html_tagdatas.unshift(tagdata)
            } else if (e.ctrlKey) {
                html_tagdatas.push(tagdata)
            } else {
                html_tagdatas.unshift(tagdata)
            }

            switch (tagname) {
                case "table": {
                    this.table_rows = 1
                    this.table_cols = 1
                    this.table_initialize_target = tagdata as TableTagData
                    this.is_show_table_initialize_dialog = true
                    break
                }
                case "ul": {
                    this.ul_items = 1
                    this.ul_initialize_target = tagdata as ULTagData
                    this.is_show_ul_initialize_dialog = true
                    break
                }
                case "ol": {
                    this.ol_items = 1
                    this.ol_initialize_target = tagdata as OLTagData
                    this.is_show_ol_initialize_dialog = true
                    break
                }
                case "img": {
                    this.img_src = ""
                    this.img_initialize_target = tagdata as IMGTagData
                    this.is_show_img_initialize_dialog = true
                    break
                }
            }
        } else if (tagid) {
            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (e.dataTransfer.getData("ppmk/struct_li_id") == tagdatas[i].tagid) {
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
            walk_tagdatas(html_tagdatas)
            move_tagdata.position_style = PositionStyle.Absolute

            if (e.shiftKey) {
                html_tagdatas.unshift(move_tagdata)
            } else if (e.ctrlKey) {
                html_tagdatas.push(move_tagdata)
            } else {
                html_tagdatas.push(move_tagdata)
            }
        }

        this.updated_html_tagdatas(html_tagdatas)
    }

    dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/struct_li_id")) e.dataTransfer.dropEffect = "move"
        else if (e.dataTransfer.getData("ppmk/move_tag_id")) e.dataTransfer.dropEffect = "move"
        else if (e.dataTransfer.getData("ppmk/htmltag")) e.dataTransfer.dropEffect = "move"
        else if (e.dataTransfer.files.length != 0) e.dataTransfer.dropEffect = "copy"
        // else e.dataTransfer.dropEffect = "none"
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

            let tagdatas = new Array<HTMLTagDataBase>()
            this.html_tagdatas.forEach((child_tagdata) => { tagdatas.push(child_tagdata.clone()) })
            tagdatas.push(copied_tagdata)
            this.updated_html_tagdatas(tagdatas)
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
        this.updated_tagdata(this.table_initialize_target)
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
        this.updated_tagdata(this.ul_initialize_target)
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
}
</script>
<style scoped>
li {
    margin-left: 20px;
}

.dropzone_wrap {
    margin-bottom: 20px;
}

.struct_view {
    width: fit-content;
}

.mainside h2{
    font-family: "Roboto", sans-serif;
    font-size: 30px;
    color: steelblue;  
}
</style>