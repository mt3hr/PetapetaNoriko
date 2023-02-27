<template>
    <div>
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
            <tr class="share_link" v-if="login_system && session_id && enable_share_view_feature">
                <td>
                    共有
                </td>
                <td>
                    <v-btn @click="is_show_manage_share_dialog = true">管理</v-btn>
                </td>
            </tr>
        </table>
        <v-dialog v-model="is_show_manage_share_dialog">
            <v-card class="pa-5">
                <v-card-title>共有管理</v-card-title>
                <p v-if="!is_firefox">FireFoxでお試しください</p>
                <v-checkbox :readonly="!is_firefox && !is_shared_view" v-model="is_shared_view" :label="'共有'" />
                <input type="url" readonly v-model="share_link" />
                <v-row>
                    <v-col cols="auto">
                        <v-btn @click="is_show_manage_share_dialog = false">閉じる</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Project, { PPMKProject } from '@/project/Project'
import { deserialize } from '@/serializable/serializable'
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import API from '@/view/login_system/api'

export default class ProjectPropertyView extends Vue {
    @Prop() editor_mode: boolean
    @Prop() session_id: string
    @Prop() login_system: boolean
    @Prop() enable_share_view_feature: boolean
    project: Project = new Project()
    project_name = ""
    is_shared_view = false
    share_link = ""

    is_show_manage_share_dialog = false

    is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    @Watch('is_shared_view')
    update_share_link() {
        if (this.is_shared_view) {
            this.share_link = this.generate_share_view_link()
        } else {
            this.share_link = ""
        }
    }

    updated_project() {
        this.project_name = this.project.ppmk_project.project_name
        this.is_shared_view = this.project.ppmk_project.is_shared_view
    }

    mounted() {
        this.project.project_id = ""
        this.updated_project()
    }

    @Watch('project_name')
    update_project_info() {
        if (this.project.project_id == "") return
        let ppmk_project = new PPMKProject()
        ppmk_project.project_id = this.project.ppmk_project.project_id
        ppmk_project.project_name = this.project_name
        ppmk_project.is_shared_view = this.is_shared_view
        this.$emit("updated_project_info", ppmk_project)
    }

    @Watch('is_shared_view')
    update_is_shared_view() {
        this.update_project_info()
        this.$emit("update_is_share_view")
    }

    new_project() {
        this.$emit("new_project")
    }

    share_view(do_share: boolean) {
        this.is_shared_view = do_share
        this.updated()
    }

    generate_share_view_link() {
        return location.protocol + "//" + location.host + "?shared_project_id=" + this.project.ppmk_project.project_id
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