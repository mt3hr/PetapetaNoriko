<template>
    <v-container>
        <v-row class="ppmk_row">
            <v-col cols="auto">
                <h1><a @click="to_toppage" :style="title_style">PutPullMock</a></h1>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-checkbox class="checkbox mx-3" v-if="editor_mode" v-model="show_border" :label="'境界を表示'" />
            </v-col>
            <v-col v-if="enable_system" cols="auto">
                <v-btn v-if="!session_id" @click="login">ログイン</v-btn>
                <v-btn v-else @click="logout">ログアウト</v-btn>
            </v-col>
            <v-btn icon v-if="editor_mode" @click="show_options_dialog">
                <v-icon>mdi-cog</v-icon>
            </v-btn>
        </v-row>
        <v-row class="ppmk_row ppmk_main_pane">
            <!--サイドバー-->
            <v-col cols="auto" class="sidebar">
                <v-container>
                    <v-row>
                        <v-col cols="auto">
                            <ProjectPropertyView class="component project_view" ref="project_view"
                                @new_project="show_new_project_dialog" @updated_project_info="update_project_info" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <!--ページリストビュー。ここをクリックしてページを選択する-->
                        <v-col cols="auto">
                            <PageListView class="component page_list_view" ref="page_list_view"
                                @deleted_page="deleted_page" @updated_pagedatas="update_pagedatas"
                                :editor_mode="editor_mode" @clicked_page="show_page" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <!--タグリストビュー。ここからタグをドラッグしてドロップゾーンに貼り付ける-->
                        <v-col cols="auto">
                            <TagListView v-show="editor_mode" :mode="tag_list_view_mode"
                                class="component html_tag_list_view" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>

            <!--ドロップゾーン-->
            <v-col cols="auto" class="dropzone_wrap">
                <DropZone :show_border="show_border" class="component dropzone" ref="dropzone"
                    :editor_mode="editor_mode" :clicked_tagdata="clicked_tagdata"
                    @updated_tagdatas_root="updated_htmltagdatas" @add_page="add_page"
                    @updated_htmltagdatas="updated_htmltagdatas" :copied_tagdata="copied_tagdata" @copy_tag="copy_tag"
                    @onclick_tag="onclick_tag" :dropzone_style="dropzone_style" />
            </v-col>

            <!--プロパティビュー-->
            <v-col cols="auto" class="propertyview" v-show="editor_mode">
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
                            <HTMLTagPropertyView class="component property_view" ref="tag_property_view"
                                :auto_focus_tag_property_view="auto_focus_tag_property_view"
                                @updated_html_tag_property="updated_html_tag_property" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="auto">
                            <!--構造ビュー-->
                            <HTMLTagStructView @onclick_tag="onclick_tag" class="component struct_view"
                                @updated_tagdata="updated_tagdata" :copied_tagdata="copied_tagdata"
                                :clicked_tagdata="clicked_tagdata" @copy_tag="copy_tag" ref="tag_struct_view"
                                :auto_scroll_tag_struct_view="auto_scroll_tag_struct_view"
                                @delete_tagdata="delete_tagdata" @updated_html_tagdatas="updated_htmltagdatas" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row class="ppmk_row" v-if="editor_mode">
            <v-col cols="auto">
                <v-btn @click="is_show_css_dialog = true">CSS</v-btn>
                <v-btn @click="is_show_webfont_dialog = true">WebFont</v-btn>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn @click="show_readin_dialog">読み込み</v-btn>
                <v-btn @click="show_writeout_dialog">書き出し</v-btn>
            </v-col>
        </v-row>
    </v-container>

    <v-dialog v-model="is_show_css_dialog">
        <v-card class="pa-5" :style="page_css_view_style">
            <v-card-title>
                <v-row>
                    <v-col cols="auto">
                        ページCSS
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-checkbox class="checkbox" v-model="transparent_page_css_view" :label="'透過'"></v-checkbox>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-textarea id="css_text_area" v-model="css" @keydown="updated_css" :rows="20" placeholder="img {
  width: 200px;
  height: auto;
}"></v-textarea>
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_css_dialog = false">閉じる</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
    <v-dialog v-model="is_show_readin_dialog" width="unset">
        <v-card class="pa-5">
            <v-row>
                <v-col>
                    <input type="file" @change="read_ppmk_project" />
                </v-col>
            </v-row>
            <v-row v-if="enable_system && session_id">
                <v-col>
                    <ProjectSummariesList v-if="session_id" @loaded_project="loaded_project" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_readin_dialog = false">閉じる</v-btn>
                </v-col>
                <v-spacer />
            </v-row>
        </v-card>
    </v-dialog>
    <v-dialog v-model="is_show_webfont_dialog">
        <v-card class="pa-5">
            <v-card-title>ページウェブフォント</v-card-title>
            <v-card-text>使用するウェブフォントのリンクを改行区切りで記述してください</v-card-text>
            <v-textarea v-model="page_webfont" :rows="20" placeholder="https://fonts.googleapis.com/css?family=M+PLUS+1p
https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c"></v-textarea>
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_webfont_dialog = false">閉じる</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
    <v-dialog id="writeout_dialog" v-model="is_show_writeout_dialog">
        <v-card class="pa-5">
            <v-card-title>ページHTML</v-card-title>
            <v-row>
                <v-col>
                    <v-checkbox class="checkbox" @change="update_page_html" v-model="export_head" :label="'ヘッダ'" />
                </v-col>
                <v-col>
                    <v-checkbox class="checkbox" @change="update_page_html" v-model="export_base64_image"
                        :label="'埋め込み画像'" />
                </v-col>
                <v-col>
                    <v-checkbox class="checkbox" @change="update_page_html" v-model="export_position_css"
                        :label="'位置情報'" />
                </v-col>
            </v-row>
            <v-textarea v-model="page_html" :readonly="true" :rows="20"></v-textarea>
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_writeout_dialog = false">閉じる</v-btn>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                    <v-btn @click="print_this_page">このページを印刷する</v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="save_ppmk_html_css_this_page">このページをHTMLファイルに保存</v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="save_ppmk_html_css_all_pages">すべてのページをHTMLファイルに保存</v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="save_ppmk_project">プロジェクトを保存</v-btn>
                </v-col>
                <v-col v-if="enable_system && session_id" cols="auto">
                    <v-btn @click="show_save_to_server_dialog">プロジェクトをサーバに保存</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="is_show_save_to_server_dialog">
        <v-card class="pa-5">
            <v-card-title>サーバに保存</v-card-title>
            <v-textarea v-model="project_data_memo" placeholder="メモ" />
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_writeout_dialog = false">閉じる</v-btn>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                    <v-btn @click="() => { apply_project_data_memo(); save_ppmk_project_to_server() }">保存</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="is_show_new_project_dialog" width="unset">
        <v-card class="pa-5">
            <v-card-title>プロジェクト新規作成</v-card-title>
            <p>プロジェクトを新規作成します</p>
            <p>注: 保存されていない作業は破棄されます</p>
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_new_project_dialog = false">閉じる</v-btn>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                    <v-btn @click="new_project">新規作成</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="is_show_options_dialog" width="unset">
        <v-card class="pa-5">
            <v-card-title>設定</v-card-title>
            <v-row>
                <v-col cols="auto">
                    <h3>全般</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" v-model="show_border" :label="'境界を表示'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" v-model="auto_save_project_data_to_localstorage" :label="'自動保存'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" v-model="use_undo" :label="'Undo機能'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" v-model="auto_focus_tag_property_view" :label="'プロパティビューオートフォーカス'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" v-model="auto_scroll_tag_struct_view" :label="'構造ビュー自動スクロール'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-text>HTML要素一覧の表示</v-text>
                    <v-radio-group v-model="tag_list_view_mode">
                        <v-radio :label="'タグ名と画像'" :value="TagListViewMode.TextAndImage" />
                        <v-radio :label="'タグ名'" :value="TagListViewMode.Text" />
                        <v-radio :label="'画像'" :value="TagListViewMode.Image" />
                    </v-radio-group>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="auto">
                    <h3>CSS編集画面</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" v-model="transparent_page_css_view" :label="'透過'"></v-checkbox>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <h3>出力画面</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" @change="update_page_html" v-model="export_head" :label="'ヘッダ'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" @change="update_page_html" v-model="export_base64_image"
                        :label="'埋め込み画像'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-checkbox class="checkbox" @change="update_page_html" v-model="export_position_css"
                        :label="'位置情報'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_options_dialog = false">閉じる</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
    <v-dialog v-if="editor_mode" v-model="is_show_oversize_localstorage_dialog" width="unset">
        <v-card class="pa-5">
            <v-card-title>
                自動保存容量超過
            </v-card-title>
            <v-card-text>
                データが大きすぎるため自動保存できません。
                自動保存機能を無効化します。
                （書き出しはできます）
            </v-card-text>

            <v-row>
                <v-col cols="auto">
                    <v-btn @click="is_show_oversize_localstorage_dialog = false">閉じる</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
// グローバルナビゲーション 横並びリストはCSSに3行追加すればいいだけだから実装しなくていいか
//TODO サーバからのプロジェクトデータの削除
//TODO サーバからのプロジェクトの削除
//TODO 卒業制作用POSTからProjectDataを読み込むやつ
//TODO 卒業制作用サーバにデータを保存するやつ。
import { Vue, Options } from 'vue-class-component'
import PageListView from '@/view/PageListView.vue'
import TagListView from '@/view/TagListView.vue'
import DropZone from '@/view/DropZone.vue'
import HTMLTagPropertyView from '@/view/HTMLTagPropertyView.vue'
import PagePropertyView from '@/view/PagePropertyView.vue'
import HTMLTagDataBase, { GenerateHTMLOptions, PositionStyle } from '@/html_tagdata/HTMLTagDataBase'
import PageData from '@/page/PageData'
import HTMLTagStructView from './HTMLTagStructView.vue'
import { Watch } from 'vue-property-decorator'
import { deserialize, serializable } from '@/serializable/serializable'
import { head } from '@/main'
import sample_project_json from '@/sample/ppmk_sample_project.ppmk.json'
import generateUUID from '@/uuid'
import { Histories } from './History'
import Settings from './Settings'
import TagListViewMode from './TagListViewMode'
import API, { ServerStatus } from './share_view_system/api'
import Project, { clone_project, PPMKProject, PPMKProjectData, PPMKProjectShare } from '@/project/Project'
import ProjectSummariesList from '@/view/share_view_system/ProjectSummariesList.vue'
import ProjectPropertyView from './ProjectPropertyView.vue'

@Options({
    components: {
        PageListView,
        TagListView,
        DropZone,
        HTMLTagPropertyView,
        PagePropertyView,
        HTMLTagStructView,
        ProjectSummariesList,
        ProjectPropertyView,
    }
})

export default class PutPullMockRootPage extends Vue {
    page_list_view: any
    dropzone: any
    project_view: any
    page_property_view: any
    tag_property_view: any
    tag_struct_view: any

    TagListViewMode = TagListViewMode
    api = new API()
    width_dropzone = window.innerWidth - 300 - 300 - 19
    height_dropzone = window.innerHeight - 159

    is_show_css_dialog = false
    is_show_writeout_dialog = false
    is_show_readin_dialog = false
    is_show_webfont_dialog = false
    is_show_options_dialog = false
    is_show_oversize_localstorage_dialog = false
    is_show_save_to_server_dialog = false
    is_show_new_project_dialog = false
    css = ""
    page_html = ""
    page_webfont = ""

    export_base64_image = false
    export_head = true
    export_position_css = false

    show_border = false
    transparent_page_css_view = false

    auto_save_project_data_to_localstorage = true
    auto_scroll_tag_struct_view = true

    clicked_tagdata: HTMLTagDataBase = new HTMLTagDataBase()
    copied_tagdata: HTMLTagDataBase = new HTMLTagDataBase()

    tag_list_view_mode: TagListViewMode = TagListViewMode.Text

    histories: Histories = new Histories()

    use_undo = true

    auto_focus_tag_property_view = false

    editor_mode = true

    session_id: string

    project = new Project()

    enable_system = false

    first_launch = true

    preparated = false
    project_data_memo = ""

    @Watch('export_base64_image')
    @Watch('export_head')
    @Watch('export_position_css')
    @Watch('show_border')
    @Watch('transparent_page_css_view')
    @Watch('auto_save_project_data_to_localstorage')
    @Watch('auto_scroll_tag_struct_view')
    @Watch('tag_list_view_mode')
    @Watch('use_undo')
    save_settings_to_cookie() {
        let settings = new Settings()
        settings.export_base64_image = this.export_base64_image
        settings.export_head = this.export_head
        settings.export_position_css = this.export_position_css
        settings.show_border = this.show_border
        settings.transparent_page_css_view = this.transparent_page_css_view
        settings.auto_save_project_data_to_localstorage = this.auto_save_project_data_to_localstorage
        settings.auto_scroll_tag_struct_view = this.auto_scroll_tag_struct_view
        settings.tag_list_view_mode = this.tag_list_view_mode
        settings.use_undo = this.use_undo
        settings.auto_focus_tag_property_view = this.auto_focus_tag_property_view
        settings.first_launch = this.first_launch
        document.cookie = JSON.stringify(settings)
    }

    load_settings_from_cookie(): Settings {
        let settings: Settings
        if (!this.editor_mode) {
            settings = new Settings()
            return settings
        }
        try {
            settings = JSON.parse(document.cookie, deserialize)
        } catch (e) {
            this.save_settings_to_cookie()
            settings = JSON.parse(document.cookie, deserialize)
        }

        this.export_base64_image = settings.export_base64_image
        this.export_head = settings.export_head
        this.export_position_css = settings.export_position_css
        this.show_border = settings.show_border
        this.transparent_page_css_view = settings.transparent_page_css_view
        this.auto_save_project_data_to_localstorage = settings.auto_save_project_data_to_localstorage
        this.auto_scroll_tag_struct_view = settings.auto_scroll_tag_struct_view
        this.tag_list_view_mode = settings.tag_list_view_mode
        this.use_undo = settings.use_undo
        this.auto_focus_tag_property_view = settings.auto_focus_tag_property_view
        this.session_id = settings.session_id
        this.first_launch = settings.first_launch
        return settings
    }

    show_new_project_dialog() {
        this.is_show_new_project_dialog = true
    }

    new_project() {
        this.is_show_new_project_dialog = false
        let project = new Project()
        this.update_project(project)
        project.project_id = generateUUID()
        this.update_struct_view(null)
        this.updated_page_property(null)
        this.updated_html_tag_property(null)
        this.onclick_tag(null)
        this.page_list_view.project = project
        this.project_view.project = project
        this.$nextTick(() => {
            this.page_list_view.updated_project()
            this.project_view.updated_project()
            this.histories = new Histories()
            this.show_page(null)
            this.save_project_to_localstorage()
        })

    }

    mounted(): void {
        let project: Project
        try {
            project = JSON.parse(window.localStorage.getItem("ppmk_project"), deserialize)
        } catch (e) {
            // console.log(e)
        }
        this.$nextTick(() => {
            this.page_list_view = this.$refs["page_list_view"]
            this.dropzone = this.$refs["dropzone"]
            this.project_view = this.$refs["project_view"]
            this.page_property_view = this.$refs["page_property_view"]
            this.tag_property_view = this.$refs["tag_property_view"]
            this.tag_struct_view = this.$refs["tag_struct_view"]

            this.load_settings_from_cookie()

            let api = new API()
            api.status().then((server_status: ServerStatus) => {
                this.enable_system = server_status.share_view_system
            }).catch((e) => {
                this.enable_system = false
            })

            window.onkeydown = (e: KeyboardEvent) => {
                if (e.code == "KeyS" && e.ctrlKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    this.save_project_to_localstorage()
                    this.save_ppmk_project()
                }
                if (e.code == "KeyP" && e.ctrlKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    this.save_project_to_localstorage()
                    this.print_this_page()
                }
                if (e.code == "Escape") {
                    this.clicked_tagdata = null
                }
            }

            window.addEventListener('keyup', (e: KeyboardEvent) => {
                if (e.ctrlKey && e.code == "KeyZ") {
                    if ((e as any).target.nodeName == "INPUT" || (e as any).target.nodeName == "TEXTAREA") return
                    if (this.histories.index > 0) {
                        if (this.histories.index >= this.histories.histories.length) {
                            this.histories.index = this.histories.histories.length - 1
                        }
                    } else {
                        this.histories.index = 1
                    }
                    this.histories.index--
                    let project: Project = this.histories.histories[this.histories.index]
                    if (project) {
                        this.page_list_view.project = project
                        this.project_view.project = project
                        this.page_list_view.selected_index = this.histories.page_index[this.histories.index]

                        this.update_project(project)
                        this.preparated = false
                        this.$nextTick(() => {
                            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[this.histories.page_index[this.histories.index]])
                            this.$nextTick(() => {
                                this.preparated = true
                            })
                        })
                    }
                }
                if (e.ctrlKey && e.code == "KeyY") {
                    if ((e as any).target.nodeName == "INPUT" || (e as any).target.nodeName == "TEXTAREA") return
                    let project: Project
                    if (this.histories.histories.length > this.histories.index + 1) {
                        this.histories.index++
                        project = this.histories.histories[this.histories.index]
                    }
                    if (project) {
                        this.page_list_view.project = project
                        this.project_view.project = project
                        this.page_list_view.selected_index = this.histories.page_index[this.histories.index]

                        this.update_project(project)
                        this.preparated = false
                        this.$nextTick(() => {
                            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[this.histories.page_index[this.histories.index]])
                            this.$nextTick(() => {
                                this.preparated = true
                            })
                        })
                    }
                }
            })

            window.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.ctrlKey && e.code == "KeyC") {
                    if ((e as any).target.nodeName == "INPUT" || (e as any).target.nodeName == "TEXTAREA") return
                    this.copy_tag(this.clicked_tagdata)
                }
                if (e.ctrlKey && e.code == "KeyV" && this.copied_tagdata.tagname != "tagbase") {
                    if ((e as any).target.nodeName == "INPUT" || (e as any).target.nodeName == "TEXTAREA") return
                    if (!this.clicked_tagdata) {
                        this.dropzone.paste_tag()
                    } else {
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

                        const html_tagdatas = new Array<HTMLTagDataBase>()
                        this.dropzone.html_tagdatas.forEach((child_tagdata) => { html_tagdatas.push(child_tagdata.clone()) })
                        const clicked_tagdata = this.clicked_tagdata.clone()

                        if (e.altKey || !clicked_tagdata.has_child_tag) {
                            let parent_node: HTMLTagDataBase
                            let index_at_parent_node = -1
                            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>, parent: HTMLTagDataBase, parent_index: number): boolean { return false }
                            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>, parent: HTMLTagDataBase, parent_index: number): boolean {
                                for (let i = 0; i < tagdatas.length; i++) {
                                    if (clicked_tagdata.tagid == tagdatas[i].tagid) {
                                        parent_node = parent
                                        index_at_parent_node = i
                                        return true
                                    }
                                    if (walk_tagdatas(tagdatas[i].child_tagdatas, tagdatas[i], i)) {
                                        return true
                                    }
                                }
                                return false
                            }
                            walk_tagdatas(html_tagdatas, null, -1)

                            if (e.shiftKey) {
                                if (!parent_node) {
                                    this.dropzone.html_tagdatas.unshift(copied_tagdata)
                                } else {
                                    parent_node.child_tagdatas.splice(index_at_parent_node, 0, copied_tagdata)
                                }
                            } else if (e.ctrlKey) {
                                if (!parent_node) {
                                    this.dropzone.html_tagdatas.push(copied_tagdata)
                                } else {
                                    parent_node.child_tagdatas.splice(index_at_parent_node + 1, 0, copied_tagdata)
                                }
                            } else {
                                if (!parent_node) {
                                    this.dropzone.html_tagdatas.push(copied_tagdata)
                                } else {
                                    parent_node.child_tagdatas.splice(index_at_parent_node + 1, 0, copied_tagdata)
                                }
                            }
                            this.dropzone.updated_tagdata(parent_node)
                        } else {
                            if (e.shiftKey) {
                                clicked_tagdata.child_tagdatas.unshift(copied_tagdata)
                            } else if (e.ctrlKey) {
                                clicked_tagdata.child_tagdatas.push(copied_tagdata)
                            } else {
                                clicked_tagdata.child_tagdatas.unshift(copied_tagdata)
                            }
                            this.dropzone.updated_tagdata(clicked_tagdata)
                        }
                        this.onclick_tag(clicked_tagdata)
                    }
                }
                if (e.ctrlKey && e.code == "KeyX" && this.clicked_tagdata) {
                    if ((e as any).target.nodeName == "INPUT" || (e as any).target.nodeName == "TEXTAREA") return
                    this.copy_tag(this.clicked_tagdata)
                    this.dropzone.delete_tagdata(this.clicked_tagdata)
                    this.clicked_tagdata = null
                }
                if (e.code == "Delete" && this.clicked_tagdata) {
                    if ((e as any).target.nodeName == "INPUT" || (e as any).target.nodeName == "TEXTAREA") return
                    this.dropzone.delete_tagdata(this.clicked_tagdata)
                }
            })

        })

        if (this.load_settings_from_cookie().first_launch) {
            this.$nextTick(() => {
                this.preparated = true
                this.first_launch = false
                this.save_settings_to_cookie()
                let sample_project: Project = JSON.parse(JSON.stringify(sample_project_json), deserialize)
                let about_ppmk_pagedata: PageData
                for (let i = 0; i < sample_project.ppmk_project_data.project_data.length; i++) {
                    if (sample_project.ppmk_project_data.project_data[i].pagename == "About Put Pull Mock") {
                        about_ppmk_pagedata = sample_project.ppmk_project_data.project_data[i]
                        break
                    }
                }
                let project = new Project()
                project.ppmk_project.project_name = "About Put Pull Mock"
                project.ppmk_project_data.project_data.push(about_ppmk_pagedata)
                this.$nextTick(() => {
                    this.update_project(project)
                    this.page_list_view.clicked_page(about_ppmk_pagedata)
                    this.save_project_to_localstorage()
                    this.append_history()
                })
            })
        } else {
            this.$nextTick(() => {
                this.preparated = true
                if (this.auto_save_project_data_to_localstorage) {
                    if (project.ppmk_project_data && project.ppmk_project_data.project_data && project.ppmk_project_data.project_data.length > 0) {
                        this.update_project(project)
                        this.$nextTick(() => {
                            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[0])
                            this.save_project_to_localstorage()
                            this.append_history()
                        })
                    } else {
                        this.$nextTick(() => {
                            this.page_list_view.clicked_page(null)
                        })
                    }
                }
            })
        }
    }

    get page_css_view_style(): any {
        if (this.transparent_page_css_view) {
            return {
                opacity: 0.85,
            }
        } else {
            return {}
        }
    }

    read_ppmk_project(e) {
        this.histories = new Histories()
        let file: File = e.target.files[0]
        let reader = new FileReader()
        reader.addEventListener('load', (e) => {
            let project: Project = JSON.parse(e.target.result.toString(), deserialize)
            this.update_project(project)
            this.$nextTick(() => {
                this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[0])
            })
            this.append_history()
            this.is_show_readin_dialog = false
            this.save_project_to_localstorage()
        })
        reader.readAsText(file)
    }

    async save_ppmk_project() {
        await this.api.preparate_save_ppmk_project(this.project)
        this.clicked_tagdata = new HTMLTagDataBase()
        let project_data = JSON.stringify(this.project)
        let ppmk_data_blob = new Blob([project_data])
        let url = URL.createObjectURL(ppmk_data_blob)

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = this.project.ppmk_project.project_name + '.ppmk.json';
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    save_ppmk_html_css_this_page() {
        this.clicked_tagdata = new HTMLTagDataBase()
        let page_index = this.page_list_view.selected_index
        let pagedata = this.project.ppmk_project_data.project_data[page_index]
        let export_options = new GenerateHTMLOptions()
        export_options.export_base64_image = this.export_base64_image
        export_options.export_head = this.export_head
        export_options.export_id = this.export_position_css
        export_options.export_position_css = this.export_position_css
        let html = ""
        if (pagedata) {
            html = pagedata.generate_html(export_options)
        }
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
    }

    save_ppmk_html_css_all_pages() {
        this.clicked_tagdata = new HTMLTagDataBase()
        this.project.ppmk_project_data.project_data.forEach((pagedata: PageData) => {
            let export_options = new GenerateHTMLOptions()
            export_options.export_base64_image = this.export_base64_image
            export_options.export_head = this.export_head
            export_options.export_id = this.export_position_css
            export_options.export_position_css = this.export_position_css
            let html = pagedata.generate_html(export_options)
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

    show_options_dialog() {
        this.is_show_options_dialog = true
    }

    update_page_html() {
        let page_index = this.page_list_view.selected_index
        let pagedata: PageData = this.project.ppmk_project_data.project_data[page_index]
        let export_options = new GenerateHTMLOptions()
        export_options.export_base64_image = this.export_base64_image
        export_options.export_head = this.export_head
        export_options.export_id = this.export_position_css
        export_options.export_position_css = this.export_position_css
        let html = ""
        if (pagedata) {
            html = pagedata.generate_html(export_options)
        }
        this.page_html = html
    }

    updated_htmltagdatas(html_tagdatas: Array<HTMLTagDataBase>, tagdata: HTMLTagDataBase, history_mode: boolean) {
        if (!html_tagdatas) return
        if (history_mode) this.append_history()

        this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas = html_tagdatas

        this.$nextTick(() => {
            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index])
        })
        this.update_struct_view(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas)
        if (history_mode) this.append_history()
        this.save_project_to_localstorage()
    }

    show_page(pagedata: PageData) {
        if (!pagedata) {
            this.page_property_view.page_data = null
            this.dropzone.html_tagdatas = null

            this.width_dropzone = window.innerWidth - 300 - 300 - 19
            this.height_dropzone = window.innerHeight - 159



            return
        }
        let html_tagdatas = pagedata.html_tagdatas
        this.dropzone.html_tagdatas = html_tagdatas

        this.page_property_view.page_data = pagedata
        this.width_dropzone = pagedata.width
        this.height_dropzone = pagedata.height
        this.onclick_tag(null)

        if (this.page_list_view.selected_index >= 0) {
            this.update_struct_view(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas)
            this.css = this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].css
            this.page_webfont = this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].webfonts.join("\n")
        }
        this.update_page_webfont()
        this.save_project_to_localstorage()
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        if (!this.editor_mode) return
        this.tag_property_view.html_tagdata = new HTMLTagDataBase()
        this.tag_property_view.html_tagdata = tagdata
        this.clicked_tagdata = tagdata
    }

    updated_html_tag_property(html_tagdata: HTMLTagDataBase) {
        if (!this.project.ppmk_project_data.project_data[this.page_list_view.selected_index]) return
        let tagdatas: Array<HTMLTagDataBase> = this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas

        let updated_tagdata: HTMLTagDataBase

        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                if (html_tagdata.tagid == tagdatas[i].tagid) {
                    tagdatas.splice(i, 1, html_tagdata)
                    updated_tagdata = html_tagdata
                    return true
                }
                if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                    return true
                }
            }
            return false
        }
        walk_tagdatas(tagdatas)
        if (this.project.ppmk_project_data.project_data[this.page_list_view.selected_index]) {
            this.update_struct_view(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas)
        }
        this.tag_property_view.html_tagdata = updated_tagdata
        this.page_list_view.save_pagedatas_to_localstorage()
    }
    updated_page_property(page_data: PageData) {
        for (let i = 0; i < this.project.ppmk_project_data.project_data.length; i++) {
            if (this.project.ppmk_project_data.project_data[i].pageid == page_data.pageid) {
                this.project.ppmk_project_data.project_data.splice(i, 1, page_data)
                break
            }
        }
        this.$nextTick(() => {
            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index])
        })
        if (this.project.ppmk_project_data.project_data[this.page_list_view.selected_index]) {
            this.update_struct_view(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas)
            this.page_list_view.save_pagedatas_to_localstorage()
        }
    }

    update_struct_view(tagdatas: Array<HTMLTagDataBase>) {
        this.tag_struct_view.html_tagdatas = tagdatas
    }

    get dropzone_style(): any {
        return {
            "width": this.width_dropzone + "px",
            "height": this.height_dropzone + "px",
        }
    }

    update_project(project: Project) {
        if (!this.preparated) return
        if (!project) return
        if (!this.dropzone ||
            !this.page_list_view ||
            !this.project_view) {
            this.$nextTick(() => {
                this.update_project(project)
            })
            return
        }

        this.project = project
        this.page_list_view.project = project
        this.project_view.project = project
        this.$nextTick(() => {
            this.page_list_view.updated_project()
            this.project_view.updated_project()
            this.save_project_to_localstorage()
        })
    }

    @Watch('css')
    updated_css(e) {
        if (e) {
            if (e.key == "Tab") {
                e.preventDefault()
                let css_text_area: any = document.getElementById("css_text_area")
                let selectionStart = css_text_area.selectionStart
                css_text_area.value =
                    css_text_area.value.substr(0, css_text_area.selectionStart) +
                    "    " +
                    css_text_area.value.substr(css_text_area.selectionStart)
                css_text_area.selectionStart = selectionStart + 4
                css_text_area.selectionEnd = selectionStart + 4
                return
            }
        }

        this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].css = this.css
        this.dropzone.style_user_edited = this.css
    }
    @Watch('page_webfont')
    updated_page_webfont() {
        let webfonts: Array<string> = new Array<string>()
        if (this.page_webfont) {
            webfonts = this.page_webfont.split("\n")
        }
        for (let i = 0; i < webfonts.length; i++) {
            webfonts[i] = webfonts[i].trim()
        }
        webfonts = webfonts.filter((webfont, i, webfonts) => {
            return webfont != ""
        })
        this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].webfonts = webfonts
        this.update_page_webfont()
        this.save_project_to_localstorage()
    }

    update_page_webfont() {
        if (!this.project.ppmk_project_data.project_data[this.page_list_view.selected_index]) {
            this.$nextTick(() => {
                this.update_page_webfont()
            })
            return
        }
        let page_web_font_links = []
        for (let i = 0; i < this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].webfonts.length; i++) {
            let page_web_font = this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].webfonts[i]
            page_web_font_links.push({
                href: page_web_font,
                rel: "stylesheet",
            })
        }
        head.push({
            link: page_web_font_links
        })
    }

    print_this_page() {
        this.clicked_tagdata = new HTMLTagDataBase()
        // https://beelabo.com/web/1423
        let area = document.getElementById("dropzone_body").outerHTML
        let head = ""
        let cmd = '<' + 'script' + '>' + 'window.print(); window.close()' + '<' + '/script' + '>'
        let links = document.getElementsByTagName("link")
        for (let i = 0; i < links.length; i++) {
            head = head + links[i].outerHTML
        }
        let styles = document.getElementsByTagName("style")
        for (let i = 0; i < styles.length; i++) {
            head = head + styles[i].outerHTML
        }
        head += "<style>" + this.css + "</style>"
        let sub = window.open()
        sub.document.write("<html><head>" + head + "</head>" + area + cmd + "</html>")
    }

    delete_tagdata(tagdata: HTMLTagDataBase) {
        this.append_history()
        let tagdatas: Array<HTMLTagDataBase> = this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas

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
        walk_tagdatas(tagdatas)
        this.project.ppmk_project_data.project_data[this.page_list_view.selected_index].html_tagdatas = tagdatas
        this.show_page(this.project.ppmk_project_data.project_data[this.page_list_view.selected_index])
        this.save_project_to_localstorage()
    }

    append_history() {
        if (!this.use_undo || !this.editor_mode) {
            return
        }
        if (!this.project) {
            return
        }
        if (this.histories.histories[this.histories.index - 1]) {
            if (JSON.stringify(this.histories.histories[this.histories.index - 1]) == JSON.stringify(this.project)) {
                return
            }
        }

        this.histories.histories.length = this.histories.index
        this.histories.histories[this.histories.index] = clone_project(this.project)
        this.histories.page_index.length = this.histories.index + 1
        if (this.page_list_view) {
            this.histories.page_index[this.histories.index] = this.page_list_view.selected_index
        }
        this.histories.index++
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.copied_tagdata = tagdata
    }

    deleted_page() {
        this.$nextTick(() => {
            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[0])
        })
        this.page_property_view.page_data = null
        this.dropzone.html_tagdatas = null
        this.update_struct_view(null)
        this.onclick_tag(null)

        this.width_dropzone = window.innerWidth - 300 - 300 - 19
        this.height_dropzone = window.innerHeight - 159

        this.save_project_to_localstorage()
    }

    add_page() {
        this.page_list_view.add_page()
        this.save_project_to_localstorage()
        this.update_project(this.project)
    }

    updated_tagdata(tagdata: HTMLTagDataBase) {
        this.dropzone.updated_tagdata(tagdata)
        this.save_project_to_localstorage()
    }
    to_toppage() {
        if (this.editor_mode) return
        this.$router.push("/")
    }
    get title_style(): any {
        if (this.editor_mode) {
            return { 'color': 'black', 'text-decoration': 'none', 'cursor': 'pointer' }
        } else {
            return { 'color': 'black', 'text-decoration': 'none' }
        }
    }
    login() {
        this.$router.push('/login')
    }
    logout() {
        let api = new API()
        api.logout().then(() => {
            location.reload()
        })
    }

    loaded_project(ppmk_project: PPMKProject, project_data: PPMKProjectData, project_share: PPMKProjectShare) {
        let project = new Project()

        project.ppmk_project = ppmk_project
        project.ppmk_project_data = project_data
        project.ppmk_project_share = project_share

        this.update_project(project)
        this.$nextTick(() => {
            this.page_list_view.clicked_page(this.project.ppmk_project_data.project_data[0])
        })
        this.is_show_readin_dialog = false
        this.save_project_to_localstorage()
    }

    show_save_to_server_dialog() {
        this.is_show_writeout_dialog = false
        this.is_show_save_to_server_dialog = true
    }

    apply_project_data_memo() {
        this.project.ppmk_project_data.memo = this.project_data_memo
        this.project_data_memo = ""
    }

    async save_ppmk_project_to_server() {
        this.is_show_save_to_server_dialog = false
        await this.api.preparate_save_ppmk_project(this.project)
        let api = new API()
        let project: Project = this.project
        project.ppmk_project_data.project_data_id = generateUUID()
        let update_project_response = await api.update_project(api.session_id, project)
        let save_project_data_response = await api.save_project_data(api.session_id, project)
    }

    @Watch('project')
    save_project_to_localstorage() {
        if (!this.preparated) return
        if (this.auto_save_project_data_to_localstorage) {
            try {
                let project = JSON.stringify(this.project)
                window.localStorage.setItem("ppmk_project", project)
            } catch (e) {
                this.is_show_oversize_localstorage_dialog = true
                this.auto_save_project_data_to_localstorage = false
                this.clear_pagedatas_at_localstorage()
            }
        }
    }

    @Watch('auto_save_project_data_to_localstorage')
    clear_pagedatas_at_localstorage() {
        if (!this.auto_save_project_data_to_localstorage) {
            window.localStorage.setItem("ppmk_project", "")
        }
    }

    update_project_info(project_info: PPMKProject) {
        let project = this.project
        project.ppmk_project = project_info
        this.update_project(project)
    }

    update_pagedatas(pagedatas: Array<PageData>) {
        let project = this.project
        project.ppmk_project_data.project_data = pagedatas
        this.update_project(project)
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
    height: calc(100vh - 104px + 18px);
    width: calc(100vw - 300px - 300px);
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
    height: calc(100vh - 423px + 44px + 18px);
    overflow-y: scroll;
}

.page_property_view {
    height: 145px;
    overflow: scroll;
}

.project_view {
    height: 125px;
    overflow: scroll;
}

.property_view {
    height: calc(100vh - 574px + 18px);
    overflow: scroll;
}

.struct_view {
    height: 325px;
    overflow: scroll;
}

.v-container {
    width: fit-content;
}

.ppmk_row {
    width: 100vw;
    flex-wrap: nowrap;
}

.v-input__details {
    display: none;
}

.checkbox {
    position: relative;
    height: 50px;
    top: -7px;
}
</style>
<style>
input,
select,
textarea {
    border: solid 1px silver !important;
}

body {
    overflow: scroll !important;
}
</style>