<template>
    <div :style="style">
        <h2>
            ページ一覧
            <v-btn v-if="editor_mode" @click="add_page">+</v-btn>
        </h2>
        <ul>
            <PageListItem v-for="(pagedata, index) in this.project.pagedatas" :pagedata="pagedata" :key="index"
                :editor_mode="editor_mode" @copy_page="(pagedata) => copy_page(pagedata, index)"
                :style="generate_style(index)" @move_pagedata="(e, pagedata) => move_pagedata(e, pagedata, index)"
                @clicked_page="clicked_page" :selected="selected_index == index" @delete_page="delete_page" />
        </ul>
        <v-dialog v-if="editor_mode" v-model="is_show_oversize_localstorage_dialog">
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
    </div>
</template>
<script lang="ts">
import PageData from '@/page/PageData';
import PageListItem from '@/page/PageListItem.vue';
import Project from '@/page/Project';
import { deserialize } from '@/serializable/serializable';
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
    components: {
        PageListItem,
    }
})
export default class Page extends Vue {
    selected_index = 0
    project: Project = new Project()
    @Prop() auto_save_pagedatas_to_localstorage: boolean
    @Prop() editor_mode: boolean
    @Prop() project_name: string

    is_show_oversize_localstorage_dialog = false

    @Watch('project_name')
    update_project_name() {
        this.project.project_name = this.project_name
    }

    @Watch('pagedatas')
    save_pagedatas_to_localstorage() {
        let pagedata = JSON.stringify(this.project.pagedatas)
        if (this.auto_save_pagedatas_to_localstorage) {
            try {
                window.localStorage.setItem("ppmk_pagedatas", pagedata)
            } catch (e) {
                this.is_show_oversize_localstorage_dialog = true
                this.$emit("update_auto_save_pagedatas_to_localstorage", false)
                this.clear_pagedatas_at_localstorage()
            }
        }
    }

    @Watch('auto_save_pagedatas_to_localstorage')
    clear_pagedatas_at_localstorage() {
        if (!this.auto_save_pagedatas_to_localstorage) {
            window.localStorage.setItem("ppmk_pagedatas", "")
        }
    }

    clicked_page(pagedata: PageData) {
        for (let i = 0; i < this.project.pagedatas.length; i++) {
            if (pagedata.pageid == this.project.pagedatas[i].pageid) {
                this.selected_index = i
                break
            }
        }
        this.$nextTick(() => {
            this.$emit('clicked_page', pagedata)
        })
    }

    delete_page(pagedata: PageData) {
        let deleteindex = -1
        for (let i = 0; i < this.project.pagedatas.length; i++) {
            if (pagedata.pageid == this.project.pagedatas[i].pageid) {
                deleteindex = i
                break
            }
        }
        if (deleteindex != -1) {
            this.project.pagedatas.splice(deleteindex, 1)
            this.$emit('delete_page', pagedata)
        }
    }

    created(): void {
        if (this.auto_save_pagedatas_to_localstorage) {
            try {
                this.project.pagedatas = JSON.parse(window.localStorage.getItem("ppmk_pagedatas"), deserialize)
                if (this.project.pagedatas && this.project.pagedatas.length > 0) {
                    this.clicked_page(this.project.pagedatas[0])
                } else {
                    this.clicked_page(null)
                }
            } catch (e) {
                this.add_page()
            }
        } else {
            this.add_page()
        }
    }

    generate_style(index: number): any {
        if (index == this.selected_index) {
            return {
                "font-weight": "bold"
            }
        }
        return {}
    }

    add_page() {
        let pagedata = new PageData()
        this.project.pagedatas.push(pagedata)
        this.clicked_page(pagedata)
    }

    copy_page(pagedata: any, index: number) {
        this.project.pagedatas.splice(index + 1, 0, pagedata)
        this.clicked_page(pagedata)
    }

    move_pagedata(e: DragEvent, pagedata: PageData, index: number) {
        if (e.dataTransfer.getData("ppmk/move_page_id") == pagedata.pageid) {
            return
        }

        let pagedatas = new Array<PageData>()
        this.project.pagedatas.forEach((child_tagdata) => { pagedatas.push(child_tagdata.clone()) })

        let move_pagedata: PageData
        for (let i = 0; i < pagedatas.length; i++) {
            if (e.dataTransfer.getData("ppmk/move_page_id") == pagedatas[i].pageid) {
                move_pagedata = pagedatas[i]
                pagedatas.splice(i, 1)
                break
            }
        }

        pagedatas.splice(index, 0, move_pagedata)
        this.project.pagedatas = pagedatas
        this.selected_index = index
        this.clicked_page(this.project.pagedatas[index])
    }
    get style(): any {
        if (this.editor_mode) {
            return {}
        } else {
            return {
                'height': window.innerHeight - 104 + "px !important"
            }
        }
    }
}
</script>
