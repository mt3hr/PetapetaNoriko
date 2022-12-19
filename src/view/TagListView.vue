<template>
    <div>
        <h2>HTML要素一覧</h2>
        <ul>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h1')">h1</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h2')">h2</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h3')">h3</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h4')">h4</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h5')">h5</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h6')">h6</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class TagListView extends Vue {
    ondrag_htmltag_listitem(e: DragEvent, tagname: string) {
        e.dataTransfer.setData("ppmk/htmltag", tagname)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}
</style>