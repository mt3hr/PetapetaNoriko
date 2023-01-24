<template>
    <div>
        <v-row v-for="project_summary, index in project_summaries" :key="index">
            <v-col>
                <ProjectSummary @loaded_project="loaded_project" :project_summary="project_summary" />
            </v-col>
        </v-row>
        <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProjectSummary from '@/view/share_view_system/ProjectSummary.vue'
import API, { PPMKProjectSummary } from './api';
import { PPMKProject, PPMKProjectData, PPMKProjectShare } from '@/project/Project';

@Options({
    components: {
        ProjectSummary,
    }
})
export default class ProjectSummariesList extends Vue {
    project_summaries = new Array<PPMKProjectSummary>()

    error_message = ""
    show_error_message_snackbar = false

    mounted(): void {
        let api = new API()
        api.list_project_summaries(api.session_id)
            .then((res) => {
                if (res.error) {
                    this.error_message = res.error
                    this.show_error_message_snackbar = true
                } else {
                    this.project_summaries = res.project_summaries
                }
            })
    }

    loaded_project(ppmk_project: PPMKProject, project_data: PPMKProjectData, ppmk_project_share: PPMKProjectShare) {
        this.$emit("loaded_project", ppmk_project, project_data, ppmk_project_share)
    }
}

</script>

<style scoped>

</style>