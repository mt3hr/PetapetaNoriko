<template>
    <li :class="tagclass" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" :id="tagdata.tagid"
        @contextmenu.prevent.stop="show_contextmenu" :style="position_css" @click.prevent.stop="onclick_tag(tagdata)"
        :value="value">{{
            text
        }}
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :copied_tagdata="copied_tagdata" :clicked_tagdata="clicked_tagdata"
            @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border" :tagdatas_root="tagdatas_root"
            @copy_tag="copy_tag" :tagdata="child_tagdata" @updated_tagdata="updated_child_tagdata"
            @onclick_tag="onclick_tag" @delete_tagdata="delete_child_tagdata" />
        <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
            <v-list>
                <v-list-item @click="copy_tag(tagdata)">コピー</v-list-item>
                <v-list-item v-if="copied_tagdata.tagname != 'tagbase'" @click="paste_tag">貼り付け</v-list-item>
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
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';
import LITagData from '@/html_tagdata/LITagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import HTMLTagView from '../HTMLTagView.vue';
import HTMLTagViewBase from './HTMLTagViewBase';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class LITagView extends HTMLTagViewBase {
    text: string
    value: string
    tagclass: string

    @Watch('text')
    @Watch('value')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: LITagData = new LITagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.text = this.text
        tagdata.value = this.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): LITagData { return this.tagdata as LITagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.text = this.tagdata_typed.text
        this.value = this.tagdata_typed.value
    }

    created(): void {
        this.update_view()
    }
}
</script>