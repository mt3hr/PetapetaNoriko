<template>
    <td :style="position_css" dropzone="true" @dragover="on_dragover" @click.prevent.stop="onclick_tag(tagdata)"
        @contextmenu.prevent.stop="show_contextmenu" :class="tagclass" :id="tagdata.tagid"
        @drop="(e) => on_drop(e, tagdata)" :colspan="colspan" :rowspan="rowspan" :headers="headers"
        @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :copied_tagdata="copied_tagdata" :clicked_tagdata="clicked_tagdata"
            @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border" :tagdatas_root="tagdatas_root"
            @copy_tag="copy_tag" :tagdata="child_tagdata" @updated_tagdata="updated_child_tagdata"
            @onclick_tag="onclick_tag" @delete_tagdata="delete_child_tagdata" />
        <v-menu v-if="is_show_contextmenu && clicked_tagdata.tagid == tagdata.tagid" v-model="is_show_contextmenu"
            :style="contextmenu_style">
            <v-list>
                <v-list-item @click="copy_tag(tagdata)">コピー</v-list-item>
                <v-list-item @click="cut_tag(tagdata)">切り取り</v-list-item>
                <v-list-item v-if="copied_tagdata.tagname != 'tagbase'" @click="paste_tag">貼り付け</v-list-item>
                <v-list-item @click="delete_tag(tagdata)">削除</v-list-item>
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
                            <v-btn @click="is_show_table_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn @click="initialize_table">作成</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
        </div>
    </td>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import TDTagData from '@/html_tagdata/TDTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';
import HTMLTagView from '@/view/HTMLTagView.vue';
import { generate_tagdata_by_tagname } from './generate_tagdata_by_tagname';
import IMGTagData from '@/html_tagdata/IMGTagData';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class TDTagView extends HTMLTagViewBase {
    tagclass: string
    colspan: string
    rowspan: string
    headers: string

    @Watch('tagclass')
    @Watch('colspan')
    @Watch('rowspan')
    @Watch('headers')
    update_tagdata() {
        let tagdata: TDTagData = new TDTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.colspan = this.colspan
        tagdata.rowspan = this.rowspan
        tagdata.headers = this.headers
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TDTagData { return this.tagdata as TDTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.colspan = this.tagdata_typed.colspan
        this.rowspan = this.tagdata_typed.rowspan
        this.headers = this.tagdata_typed.headers
    }

    created(): void {
        this.update_view()
    }

    cut_tag(tagdata: HTMLTagDataBase) {
        this.copy_tag(tagdata)
        this.delete_tag(tagdata)
    }

    @Watch('clicked_tagdata')
    update_show_contextmenu_state() {
        if (this.clicked_tagdata.tagid != this.tagdata.tagid) {
            this.is_show_contextmenu = false
        }
    }

}

</script>
<style scoped>
td {
    min-width: 30px;
    min-height: 30px;
}

.init_dialog {
    width: 280px;
}
</style>
