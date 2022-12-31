<template>
    <v-container>
        <v-row>
            <v-col cols="auto">
                <h1>PutPullMock</h1>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn>ログイン</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <!--サイドバー-->
            <v-col cols="auto" class="sidebar">
                <v-container>
                    <v-row>
                        <!--ページリストビュー。ここをクリックしてページを選択する-->
                        <PageListView class="component" ref="page_list_view" @clicked_page="clicked_page" />
                    </v-row>
                    <v-row>
                        <!--タグリストビュー。ここからタグをドラッグしてドロップゾーンに貼り付ける-->
                        <TagListView class="component" />
                    </v-row>
                </v-container>
            </v-col>

            <!--ドロップゾーン-->
            <v-col cols="auto" class="dropzone">
                <DropZone class="component" ref="dropzone" @updated_htmltagdatas="updated_htmltagdatas"
                    @onclick_tag="onclick_tag" :dropzone_style="dropzone_style" />
                <!--TODO-->
            </v-col>

            <!--プロパティビュー-->
            <v-col cols="auto" class="propertyview">
                <v-container>
                    <v-row>
                        <v-col cols="auto">
                            <!--ページプロパティビュー-->
                            <PagePropertyView class="component" ref="page_property_view"
                                @updated_page_property="updated_page_property" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="auto">
                            <!--プロパティビュー-->
                            <HTMLTagPropertyView class="component" ref="property_view"
                                @updated_html_tag_property="updated_html_tag_property" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="auto">
                            <!--構造ビュー-->
                            <HTMLTagStructView class="component" ref="struct_view"
                                @updated_html_tagdatas="(html_tagdatas) => updated_htmltagdatas(html_tagdatas, null)" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row>
            <v-spacer />
            <v-col cols="auto">
                <v-btn>読み込み</v-btn>
                <v-btn @click="print_html">書き出し</v-btn>
            </v-col>
        </v-row>
    </v-container>
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

    print_html() {
        let page_list_view: any = this.$refs['page_list_view']
        page_list_view.pagedatas.forEach(pagedata => {
            console.log(pagedata.pagename)
            console.log(pagedata.generate_html(false))
        })
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
}
</script>
<style scoped>
.component {
    border: 1px black solid;
}

.v-container,
.v-row,
.v-col {
    padding: 0px;
    margin: 0px;
}
</style>
<style>
input,
textarea {
    border: solid 1px silver !important;
}
</style>