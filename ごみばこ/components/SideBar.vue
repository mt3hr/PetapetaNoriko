<template>
    <ul>
        <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_sidebar_item(e, 'ul')">ul</li>
        <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_sidebar_item(e, 'li')">li</li>
    </ul>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class RootPanel extends Vue {
    ondrag_sidebar_item(e: DragEvent, tagname: string) {
        e.dataTransfer.setData("ppmk/component", tagname)
    }
}
</script>
