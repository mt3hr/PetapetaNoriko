<template>
    <v-container>
        <v-row class="ppmk_row">
            <v-col cols="auto">
                <h1>PutPullMock</h1>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn>ログイン</v-btn>
            </v-col>
        </v-row>
        <v-row class="ppmk_row ppmk_main_pane">
            <!--サイドバー-->
            <v-col cols="auto" class="sidebar flex-nowrap">
                <v-container>
                    <v-row>
                        <!--ページリストビュー。ここをクリックしてページを選択する-->
                        <PageListView class="component page_list_view" ref="page_list_view"
                            @clicked_page="clicked_page" />
                    </v-row>
                    <v-row>
                        <!--タグリストビュー。ここからタグをドラッグしてドロップゾーンに貼り付ける-->
                        <TagListView class="component html_tag_list_view" />
                    </v-row>
                </v-container>
            </v-col>

            <!--ドロップゾーン-->
            <v-col cols="auto" class="dropzone_wrap flex-nowrap">
                <DropZone class="component dropzone" ref="dropzone" @updated_htmltagdatas="updated_htmltagdatas"
                    @onclick_tag="onclick_tag" :dropzone_style="dropzone_style" />
                <!--TODO-->
            </v-col>

            <!--プロパティビュー-->
            <v-col cols="auto" class="propertyview flex-nowrap">
                <v-container>
                    <v-row>
                        <v-col cols="auto">
                            <!--ページプロパティビュー-->
                            <PagePropertyView class="component page_property_view" ref="page_property_view"
                                @updated_page_property="updated_page_property" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="auto">
                            <!--プロパティビュー-->
                            <HTMLTagPropertyView class="component property_view" ref="property_view"
                                @updated_html_tag_property="updated_html_tag_property" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="auto">
                            <!--構造ビュー-->
                            <HTMLTagStructView class="component struct_view" ref="struct_view"
                                @updated_html_tagdatas="(html_tagdatas) => updated_htmltagdatas(html_tagdatas, null)" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row class="ppmk_row">
            <v-col cols="auto">
                <v-btn @click="is_show_css_dialog = true">CSS編集</v-btn>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn @click="show_readin_dialog">読み込み</v-btn>
                <v-btn @click="show_writeout_dialog">書き出し</v-btn>
            </v-col>
        </v-row>
    </v-container>

    <v-dialog v-model="is_show_css_dialog">
        <v-card class="pa-5">
            <v-card-title> ページCSS </v-card-title>
            <v-textarea v-model="css" @keyup="updated_css" :rows="20"></v-textarea>
            <v-container>
                <v-row>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-btn @click="is_show_css_dialog = false">閉じる</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
    <v-dialog v-model="is_show_readin_dialog">
        <v-card class="pa-5">
            <input type="file" @change="read_ppmk_project" />
            <v-container>
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_writeout_dialog = false">閉じる</v-btn>
                    </v-col>
                    <v-spacer />
                </v-row>
            </v-container>
        </v-card>

    </v-dialog>
    <v-dialog v-model="is_show_writeout_dialog">
        <v-card class="pa-5">
            <v-card-title>ページHTML</v-card-title>
            <v-textarea v-model="page_html" :readonly="true" :rows="20"></v-textarea>
            <v-container>
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_writeout_dialog = false">閉じる</v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-btn @click="save_ppmk_html_css">すべてのページをHTMLファイルに保存</v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn @click="save_ppmk_project">プロジェクトを保存</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import PageListView from '@/view/PageListView.vue'
import TagListView from '@/view/TagListView.vue'
import DropZone from '@/view/DropZone.vue'
import HTMLTagPropertyView from '@/view/HTMLTagPropertyView.vue'
import PagePropertyView from '@/view/PagePropertyView.vue'
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase'
import PageData from '@/page/PageData'
import HTMLTagStructView from './HTMLTagStructView.vue'
import { Watch } from 'vue-property-decorator'
import { deserialize } from '@/serializable/serializable'

@Options({
    components: {
        PageListView,
        TagListView,
        DropZone,
        HTMLTagPropertyView,
        PagePropertyView,
        HTMLTagStructView,
    }
})

export default class PutPullMockRootPage extends Vue {
    width_dropzone = 100
    height_dropzone = 100
    is_show_css_dialog = false
    is_show_writeout_dialog = false
    is_show_readin_dialog = false
    css = ""
    page_html = ""

    read_ppmk_project(e) {
        let reader = new FileReader()
        reader.addEventListener('load', (e) => {
            let pagedatas = JSON.parse(e.target.result.toString(), deserialize)
            let page_list_view: any = this.$refs['page_list_view']
            page_list_view.pagedatas = pagedatas
            page_list_view.clicked_page(page_list_view.pagedatas[0])
            this.is_show_readin_dialog = false
        })
        reader.readAsText(e.target.files[0])
    }

    save_ppmk_project() {
        let page_list_view: any = this.$refs['page_list_view']
        let ppmk_data = JSON.stringify(page_list_view.pagedatas)
        let ppmk_data_blob = new Blob([ppmk_data])
        let url = URL.createObjectURL(ppmk_data_blob)

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = 'ppmk_project.json';
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    save_ppmk_html_css() {
        let page_list_view: any = this.$refs['page_list_view']
        page_list_view.pagedatas.forEach((pagedata: PageData) => {
            let html = pagedata.generate_html(false, true)
            let css = pagedata.css

            {
                let html_data_blob = new Blob([html])
                let url = URL.createObjectURL(html_data_blob)
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.download = pagedata.pagename + '.html';
                a.href = url;
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            }
            {
                let css_data_blob = new Blob([css])
                let url = URL.createObjectURL(css_data_blob)
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.download = pagedata.pagename + '.css';
                a.href = url;
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            }
        });

    }

    show_writeout_dialog() {
        this.update_page_html()
        this.is_show_writeout_dialog = true
    }

    show_readin_dialog() {
        this.is_show_readin_dialog = true
    }

    update_page_html() {
        let page_list_view: any = this.$refs["page_list_view"]
        let page_index = page_list_view.selected_index
        let pagedata: PageData = page_list_view.pagedatas[page_index]
        this.page_html = pagedata.generate_html(false, false)
    }

    updated_htmltagdatas(html_tagdatas: Array<HTMLTagDataBase>, tagdata: HTMLTagDataBase) {
        let page_list_view: any = this.$refs["page_list_view"]
        let page_index = page_list_view.selected_index
        let pagedata = page_list_view.pagedatas[page_index]
        pagedata.html_tagdatas = html_tagdatas
        if (tagdata) this.onclick_tag(tagdata)
        this.update_struct_view(page_list_view.pagedatas[page_list_view.selected_index].html_tagdatas)
    }

    clicked_page(pagedata: PageData) {
        let dropzone: any = this.$refs["dropzone"]
        let html_tagdatas = pagedata.html_tagdatas
        dropzone.html_tagdatas = html_tagdatas

        let page_property_view: any = this.$refs["page_property_view"]
        page_property_view.page_data = pagedata
        this.width_dropzone = pagedata.width
        this.height_dropzone = pagedata.height
        this.onclick_tag(null)

        let page_list_view: any = this.$refs["page_list_view"]
        this.update_struct_view(page_list_view.pagedatas[page_list_view.selected_index].html_tagdatas)
        this.css = page_list_view.pagedatas[page_list_view.selected_index].css
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        let property_view: any = this.$refs["property_view"]
        property_view.html_tagdata = new HTMLTagDataBase()
        this.$nextTick(() => {
            property_view.html_tagdata = tagdata
        })
    }

    updated_html_tag_property(html_tagdata: HTMLTagDataBase) {
        let page_list_view: any = this.$refs["page_list_view"]
        let tagdatas = page_list_view.pagedatas[page_list_view.selected_index].html_tagdatas
        let index = -1
        for (let i = 0; i < tagdatas.length; i++) {
            if (html_tagdata.tagid == tagdatas[i].tagid) {
                index = i
                break
            }
        }
        if (index != -1) {
            tagdatas.splice(index, 1, html_tagdata)
        }
        this.update_struct_view(page_list_view.pagedatas[page_list_view.selected_index].html_tagdatas)
    }
    updated_page_property(page_data: PageData) {
        let page_list_view: any = this.$refs["page_list_view"]
        for (let i = 0; i < page_list_view.pagedatas.length; i++) {
            if (page_list_view.pagedatas[i].pageid == page_data.pageid) {
                page_list_view.pagedatas.splice(i, 1, page_data)
                break
            }
        }
        page_list_view.clicked_page(page_list_view.pagedatas[page_list_view.selected_index])
        this.update_struct_view(page_list_view.pagedatas[page_list_view.selected_index].html_tagdatas)
    }

    update_struct_view(tagdatas: Array<HTMLTagDataBase>) {
        let struct_view: any = this.$refs["struct_view"]
        struct_view.html_tagdatas = tagdatas
    }

    get dropzone_style(): any {
        return {
            "width": this.width_dropzone + "px",
            "height": this.height_dropzone + "px",
        }
    }

    @Watch('css')
    updated_css() {
        let page_list_view: any = this.$refs["page_list_view"]
        page_list_view.pagedatas[page_list_view.selected_index].css = this.css
        let dropzone: any = this.$refs["dropzone"]
        dropzone.style_user_edited = this.css
    }
}
</script>
<style scoped>
.component {
    border: 1px black solid;
    overflow: hidden;
    width: 300px;
}

.dropzone_wrap {
    white-space: pre-line;
    height: 770px;
    width: fit-content;
    overflow: scroll;
}

.dropzone {
    width: fit-content;
}

.v-container,
.v-row,
.v-col {
    padding: 0px;
    margin: 0px;
}

.page_list_view {
    height: 150px;
    overflow-y: scroll;
}

.html_tag_list_view {
    height: 620px;
    overflow-y: scroll;
}

.page_property_view {
    height: 170px;
    overflow: scroll;
}

.property_view {
    height: 300px;
    overflow: scroll;
}

.struct_view {
    height: 300px;
    overflow: scroll;
}

.v-container {
    width: fit-content;
}

.ppmk_row {
    width: 100vw;
    flex-wrap: nowrap;
}

.ppmk_main_pane {
    overflow-x: scroll;
}
</style>
<style>
input,
textarea {
    border: solid 1px silver !important;
}

body {
    overflow: scroll !important;
}
</style>