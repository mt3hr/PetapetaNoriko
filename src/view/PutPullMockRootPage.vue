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
                        <PageListView class="component" ref="page_list_view" @clicked_page="clicked_page">
                        </PageListView> <!--TODO-->
                    </v-row>
                    <v-row>
                        <!--タグリストビュー。ここからタグをドラッグしてドロップゾーンに貼り付ける-->
                        <TagListView class="component"></TagListView> <!--TODO-->
                    </v-row>
                </v-container>
            </v-col>

            <!--ドロップゾーン-->
            <v-col cols="auto" class="dropzone">
                <DropZone class="component" ref="dropzone" @updated_htmltagdatas="updated_htmltagdatas"
                    @onclick_tag="onclick_tag"></DropZone>
                <!--TODO-->
            </v-col>

            <!--プロパティビュー-->
            <v-col cols="auto" class="propertyview">
                <v-container>
                    <v-row>
                        <v-col cols="auto">
                            <!--プロパティビュー-->
                            <HTMLTagPropertyView class="component" ref="property_view"
                                @updated_html_tag_property="updated_html_tag_property"></HTMLTagPropertyView>
                            <!--TODO-->
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
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase'
import PageData from '@/page/PageData'

@Options({
    components: {
        PageListView,
        TagListView,
        DropZone,
        HTMLTagPropertyView,
    }
})

export default class PutPullMockRootPage extends Vue {
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
        this.onclick_tag(tagdata)
    }
    clicked_page(pagedata: PageData) {
        let dropzone: any = this.$refs["dropzone"]
        let html_tagdatas = pagedata.html_tagdatas
        dropzone.html_tagdatas = html_tagdatas
        this.onclick_tag(null)
    }
    onclick_tag(tagdata: HTMLTagDataBase) {
        let property_view: any = this.$refs["property_view"]
        property_view.html_tagdata = new HTMLTagDataBase()
        this.$nextTick(() => {
            property_view.html_tagdata = tagdata
        })
    }
    updated_html_tag_property(html_tagdata: HTMLTagDataBase) {
        let dropzone: any = this.$refs["dropzone"]
        let index = -1
        for (let i = 0; i < dropzone.html_tagdatas.length; i++) {
            if (html_tagdata.tagid == dropzone.html_tagdatas[i].tagid) {
                index = i
                break
            }
        }
        if (index != -1) {
            dropzone.html_tagdatas.splice(index, 1, html_tagdata)
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
input {
    border: solid 1px silver !important;
}
</style>