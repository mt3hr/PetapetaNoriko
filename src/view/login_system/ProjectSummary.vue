<template>
    <div>
        <details>
            <summary>
                <p class="project_name" @contextmenu="show_project_contextmenu">{{ project_summary.ppmk_project.project_name }}</p>
            </summary>
            <ul>
                <li class="project_data_version" v-for="project_data, index in project_summary.ppmk_project_datas"
                    @contextmenu="(e) => show_project_data_contextmenu(e, project_data)" :key="index"
                    @click="e => open_project(e, project_data)">
                    <time>
                        {{ format_time(project_data.saved_time) }}
                    </time>
                    <p v-if="project_data.memo != ''" class="memo">
                        {{ project_data.memo }}
                    </p>
                </li>
            </ul>
        </details>
        <v-menu v-model="is_show_project_contextmenu" :style="contextmenu_style">
            <v-list>
                <v-list-item @click="delete_project">プロジェクトを削除</v-list-item>
            </v-list>
        </v-menu>
        <v-menu v-model="is_show_project_data_contextmenu" :style="contextmenu_style">
            <v-list>
                <v-list-item @click="delete_project_data">このバージョンを削除</v-list-item>
            </v-list>
        </v-menu>
        <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
    </div>
</template>

<script lang="ts">
import Project, { PPMKProjectData } from '@/project/Project';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import API, { PPMKProjectSummary } from './api';

export default class ProjectSummary extends Vue {
    @Prop() project_summary: PPMKProjectSummary
    is_show_project_data_contextmenu = false
    is_show_project_contextmenu = false
    x_contextmenu = 0
    y_contextmenu = 0
    context_menu_target_project_data: PPMKProjectData

    error_message = ""
    show_error_message_snackbar = false

    open_project_latest(e: MouseEvent) {
        this.open_project(e, this.project_summary.ppmk_project_datas[0])
    }

    open_project(e: MouseEvent, project_data: PPMKProjectData) {
        let api = new API()
        api.get_project_data(project_data.project_data_id)
            .then((res) => {
                this.$emit("loaded_project", this.project_summary.ppmk_project, res.project_data)
            })
    }

    format_time(time: string): string {
        return (new Date(time)).toLocaleString()
    }

    show_project_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_project_contextmenu = true
    }

    show_project_data_contextmenu(e: MouseEvent, project_data: PPMKProjectData) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.context_menu_target_project_data = project_data
        this.is_show_project_data_contextmenu = true
    }

    get contextmenu_style(): any {
        return {
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }

    async delete_project() {
        let api = new API()
        let delete_project = new Project()
        delete_project.ppmk_project = this.project_summary.ppmk_project
        delete_project.project_id = this.project_summary.ppmk_project.project_id
        let res = await api.delete_project(delete_project)
        if (res.error) {
            this.error_message = res.error
            this.show_error_message_snackbar = true
            return
        }
        this.$emit("deleted_project")
    }

    async delete_project_data() {
        let api = new API()
        let delete_project = new Project()
        delete_project.ppmk_project = this.project_summary.ppmk_project
        delete_project.ppmk_project_data = this.context_menu_target_project_data
        delete_project.project_id = this.project_summary.ppmk_project.project_id
        let res = await api.delete_project_data(delete_project)
        if (res.error) {
            this.error_message = res.error
            this.show_error_message_snackbar = true
        }
        this.$emit("deleted_project_data")
    }
}


</script>

<style scoped>
.project_data_version {
    list-style: none;
    padding-left: 30px;
}

.memo {
    padding-left: 30px;
    display: inline-block;
}

.project_name {
    display: inline;
}
</style>