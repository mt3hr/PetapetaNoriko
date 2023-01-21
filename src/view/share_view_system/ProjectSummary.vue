<template>
    <div>
        <details>
            <!--
            <summary @click="e => open_project_latest(e)">
                {{ project_summary.ppmk_project.project_name }}
            </summary>
            -->
            <summary>
                {{ project_summary.ppmk_project.project_name }}
            </summary>
            <ul>
                <li v-for="project_data, index in project_summary.ppmk_project_datas" :key="index"
                    @click="e => open_project(e, project_data)">
                    <time>
                        {{ project_data.saved_time }}
                    </time>
                    <p v-if="project_data.memo != ''">
                        {{ project_data.memo }}
                    </p>
                </li>
            </ul>
        </details>
    </div>
</template>

<script lang="ts">
import { PPMKProjectData } from '@/project/Project';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import API, { PPMKProjectSummary } from './api';

export default class ProjectSummary extends Vue {
    @Prop() project_summary: PPMKProjectSummary

    open_project_latest(e: MouseEvent) {
        this.open_project(e, this.project_summary.ppmk_project_datas[0])
    }

    open_project(e: MouseEvent, project_data: PPMKProjectData) {
        let api = new API()
        api.get_project_data(api.session_id, project_data.project_data_id)
            .then((res) => {
                this.$emit("loaded_project", this.project_summary.ppmk_project, res.project_data, this.project_summary.ppmk_project_share)
            })
    }
}

</script>

<style scoped>

</style>