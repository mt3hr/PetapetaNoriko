<template>
    <div class="mainside" :style="style">
        <h2>
            ページ一覧
            <v-btn class="button" v-if="editor_mode" @click="add_page">+</v-btn>
        </h2>
        <ul>
            <PageListItem v-for="(pagedata, index) in project_data" :pagedata="pagedata" :key="pagedata.pageid"
                :editor_mode="editor_mode" @copy_page="(pagedata) => copy_page(pagedata, index)"
                :style="generate_style(index)" @move_pagedata="(e, pagedata) => move_pagedata(e, pagedata, index)"
                @clicked_page="clicked_page" :selected="selected_index == index" @delete_page="delete_page" />
        </ul>
    </div>
</template>
<script lang="ts">
import PageData from '@/page/PageData';
import PageListItem from '@/page/PageListItem.vue';
import Project, { PPMKProjectData } from '@/project/Project';
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
    project_data = new Array<PageData>()

    project = new Project()
    @Prop() editor_mode: boolean
    @Prop() project_name: string

    mounted() {
        this.project.project_id = ""
    }

    clicked_page(pagedata: PageData) {
        if (!pagedata) {
            this.selected_index = -1
            this.$emit('clicked_page', null)
            return
        }
        for (let i = 0; i < this.project_data.length; i++) {
            if (pagedata.pageid == this.project_data[i].pageid) {
                this.selected_index = i
                break
            }
        }
        this.$emit('clicked_page', pagedata)
    }

    delete_page(pagedata: PageData) {
        let deleteindex = -1
        for (let i = 0; i < this.project_data.length; i++) {
            if (pagedata.pageid == this.project_data[i].pageid) {
                deleteindex = i
                break
            }
        }
        if (deleteindex != -1) {
            let project_data = new Array<PageData>()
            this.project_data.forEach((page_data: PageData) => {
                project_data.push(page_data)
            });
            project_data.splice(deleteindex, 1)
            if (this.project.project_id == "") return
            this.$emit("updated_pagedatas", project_data) //TODO rootpageで拾って
            this.$emit("deleted_page")
        }
    }

    updated_project() {
        this.project_data = this.project.ppmk_project_data.project_data
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
        let project_data = new Array<PageData>()
        this.project_data.forEach((page_data: PageData) => {
            project_data.push(page_data)
        });
        let pagedata = new PageData()
        project_data.push(pagedata)
        if (this.project.project_id == "") return
        this.$emit("updated_pagedatas", project_data) //TODO rootpageで拾って
        this.$nextTick(() => {
            this.clicked_page(pagedata)
        })
    }

    copy_page(pagedata: any, index: number) {
        this.project.ppmk_project_data.project_data.splice(index + 1, 0, pagedata)
        let project_data = new Array<PageData>()
        this.project_data.forEach((page_data: PageData) => {
            project_data.push(page_data)
        });
        if (this.project.project_id == "") return
        this.$emit("updated_pagedatas", project_data) //TODO rootpageで拾って
        this.$nextTick(() => {
            this.clicked_page(pagedata)
        })
    }

    move_pagedata(e: DragEvent, pagedata: PageData, index: number) {
        if (!e.dataTransfer.getData("ppmk/move_page_id")) {
            return
        }
        if (e.dataTransfer.getData("ppmk/move_page_id") == pagedata.pageid) {
            return
        }

        let project_data = new Array<PageData>()
        this.project.ppmk_project_data.project_data.forEach((child_tagdata) => { project_data.push(child_tagdata.clone()) })

        let move_pagedata: PageData
        for (let i = 0; i < project_data.length; i++) {
            if (e.dataTransfer.getData("ppmk/move_page_id") == project_data[i].pageid) {
                move_pagedata = project_data[i]
                project_data.splice(i, 1)
                break
            }
        }

        project_data.splice(index, 0, move_pagedata)
        if (this.project.project_id == "") return
        this.$emit("updated_pagedatas", project_data) //TODO rootpageで拾って
        this.$nextTick(() => {
            this.project.ppmk_project_data.project_data = project_data
            this.selected_index = index
            this.clicked_page(this.project.ppmk_project_data.project_data[index])
        })
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
<style>
.mainside h2 {
    font-family: "Roboto", sans-serif;
    font-size: 30px;
    color: steelblue;
}

.mainside {
    background: #e6e6e6;
}

.pageitem {}

.pageitem:hover {}

.v-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: steelblue;
    color: white;
    border-radius: 10px;
}

.v-button:hover {}
</style>