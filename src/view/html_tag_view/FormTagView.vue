<template>
    <form :style="position_css" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover"
        @contextmenu.prevent.stop="show_contextmenu" @click.prevent.stop="onclick_tag(tagdata)" :class="tagclass"
        :id="tagdata.tagid" :acceptcharset="acceptcharset" :action="action" :autocomplete="autocomplete"
        :enctype="enctype" :method="method" :name="name" :novalidate="novalidate" :target="target"
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
                            <v-btn @click="is_show_ul_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn @click="initialize_ul">作成</v-btn>
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
                            <v-btn @click="is_show_ol_initialize_dialog = false">閉じる</v-btn>
                        </v-col>
                        <v-spacer />
                        <v-col cols="auto">
                            <v-btn @click="initialize_ol">作成</v-btn>
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
    </form>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import FormTagData from '@/html_tagdata/FormTagData';
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
export default class FormTagView extends HTMLTagViewBase {
    tagclass: string
    acceptcharset: string
    action: string
    autocomplete: string
    enctype: string
    method: string
    name: string
    novalidate: boolean
    target: string

    @Watch('tagclass')
    @Watch('acceptcharset')
    @Watch('action')
    @Watch('autocomplete')
    @Watch('enctype')
    @Watch('method')
    @Watch('name')
    @Watch('novalidate:')
    @Watch('target')
    update_tagdata() {
        let tagdata: FormTagData = new FormTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.acceptcharset = this.acceptcharset
        tagdata.action = this.action
        tagdata.autocomplete = this.autocomplete
        tagdata.enctype = this.enctype
        tagdata.method = this.method
        tagdata.name = this.name
        tagdata.novalidate = this.novalidate
        tagdata.target = this.target
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): FormTagData { return this.tagdata as FormTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.acceptcharset = this.tagdata_typed.acceptcharset
        this.action = this.tagdata_typed.action
        this.autocomplete = this.tagdata_typed.autocomplete
        this.enctype = this.tagdata_typed.enctype
        this.method = this.tagdata_typed.method
        this.name = this.tagdata_typed.name
        this.novalidate = this.tagdata_typed.novalidate
        this.target = this.tagdata_typed.target
    }

    created(): void {
        this.update_view()
    }

    updated_child_tagdata(tagdata: HTMLTagDataBase) {
        let tagdata_typed = this.tagdata_typed.clone()
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                tagdata_typed.child_tagdatas[i] = tagdata
                break
            }
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }

    delete_child_tagdata(html_tagdata: HTMLTagDataBase) {
        let tagdata_typed = this.tagdata_typed.clone()
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

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagView = HTMLTagView
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
form {
    min-width: 30px;
    min-height: 30px;
}

.init_dialog {
    width: 280px;
}
</style>
