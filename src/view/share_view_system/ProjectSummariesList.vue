<template>
    <div>
        <v-container>
            <v-row v-for="project_summary, index in project_summaries" :key="index">
                <v-col>
                    <ProjectSummary :project_summary="project_summary" />
                </v-col>
            </v-row>
        </v-container>
        <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProjectSummary from '@/view/share_view_system/ProjectSummary.vue'
import API, { PPMKProjectSummary } from './api';

@Options({
    components: {
        ProjectSummary,
    }
})
export default class ProjectSummariesList extends Vue {
    project_summaries: Array<PPMKProjectSummary>

    error_message = ""
    show_error_message_snackbar = false

    created(): void {
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
}

</script>

<style scoped>

</style>