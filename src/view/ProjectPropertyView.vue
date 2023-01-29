<template>
    <div class="mainside" :style="style">
        <h2>プロジェクト
            <v-btn v-if="editor_mode" @click="new_project">+</v-btn>
        </h2>
        <table>
            <tr>
                <td class="project_name">
                    プロジェクト名:
                </td>
                <td>
                    <input class="textbox" type="text" :readonly="!editor_mode" v-model="project_name"
                        @keydown="update_project_info" />
                </td>
            </tr>
            <tr class="share_link" v-if="enable_share_view && session_id" v-show="false">
                <td>
                    共有
                </td>
                <td>
                    <v-btn @click="share_view(true)">管理</v-btn>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import Project, { PPMKProject } from '@/project/Project'
import { deserialize } from '@/serializable/serializable'
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import API from './share_view_system/api'

export default class ProjectPropertyView extends Vue {
    @Prop() editor_mode: boolean
    project: Project = new Project()
    project_name = ""
    is_shared_view = false
    enable_share_view = false
    session_id: string

    updated_project() {
        this.project_name = this.project.ppmk_project.project_name
        this.is_shared_view = this.project.ppmk_project.is_shared_view
    }

    mounted() {
        let api = new API()
        this.session_id = api.session_id
        api.status()
            .then((res) => {
                this.enable_share_view = res.share_view_system
            })
        this.project.project_id = ""
        this.updated_project()
    }

    @Watch('project_name')
    @Watch('is_shared_view')
    update_project_info() {
        if (this.project.project_id == "") return
        let ppmk_project = new PPMKProject()
        ppmk_project.project_id = this.project.ppmk_project.project_id
        ppmk_project.project_name = this.project_name
        ppmk_project.is_shared_view = this.is_shared_view

        this.$emit("updated_project_info", ppmk_project)
    }

    new_project() {
        this.$emit("new_project")
    }

    share_view(do_share: boolean) {
        this.is_shared_view = do_share
        this.updated()
    }

    generate_share_view_link() {
        new API().generate_share_view_link(this.project.clone())
    }
}
</script>


<style scoped>
.project_name {
    font-size: 75%;
}

.share_link {
    font-size: 75%;
}
</style>