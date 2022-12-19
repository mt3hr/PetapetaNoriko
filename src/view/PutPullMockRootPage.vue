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
                        <PageListView class="component"></PageListView> <!--TODO-->
                    </v-row>
                    <v-row>
                        <!--タグリストビュー。ここからタグをドラッグしてドロップゾーンに貼り付ける-->
                        <TagListView class="component"></TagListView> <!--TODO-->
                    </v-row>
                </v-container>
            </v-col>

            <!--ドロップゾーン-->
            <v-col cols="auto" class="dropzone">
                <DropZone class="component"></DropZone> <!--TODO-->
            </v-col>

            <!--プロパティビュー-->
            <v-col cols="auto" class="propertyview">
                <v-container>
                    <v-row>
                        <v-col cols="auto">
                            <!--プロパティビュー-->
                            <HTMLTagPropertyView class="component"></HTMLTagPropertyView> <!--TODO-->
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row>
            <v-spacer />
            <v-col cols="auto">
                <v-btn>読み込み</v-btn>
                <v-btn>書き出し</v-btn>
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

@Options({
    components: {
        PageListView,
        TagListView,
        DropZone,
        HTMLTagPropertyView,
    }
})


export default class PutPullMockRootPage extends Vue {

}
</script>
<style scoped>
.component {
    border: 1px black solid;
}
.v-container, .v-row, .v-col {
  padding: 0px;
  margin: 0px;
}
</style>