<template>
    <div>
        <h2>プロジェクト
            <v-btn @click="new_project">+</v-btn>
        </h2>
        <table>
            <tr>
                <td class="project_name">
                    プロジェクト名:
                </td>
                <td>
                    <input type="text" v-model="project_name" />
                </td>
            </tr>
            <tr class="share_link" v-if="enable_share_view">
                <td>
                    画面共有リンク
                </td>
                <td>
                    <v-btn @click="share_view(true)">管理</v-btn>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import Project from '@/project/Project'
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import API from './share_view_system/api'

export default class ProjectPropertyView extends Vue {
    @Prop() project = new Project()
    project_name = ""
    is_shared_view = false
    enable_share_view = false

    created() {
        let api = new API()
        api.status()
            .then((res) => {
                this.enable_share_view = res.share_view_system
            })
    }

    @Watch('project_name')
    updated() {
        let project = this.project.clone()
        project.ppmk_project.project_name = this.project_name
        project.ppmk_project.is_shared_view = this.is_shared_view

        this.$emit("updated_project", project)
    }

    new_project() {
        this.$emit("new_project")//TODO
    }

    share_view(do_share: boolean) {
        this.project.ppmk_project.is_shared_view = true
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