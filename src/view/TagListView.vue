<template>
    <div>
        <h2>HTML要素一覧</h2>
        <h3>基本</h3>
        <ul>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'p')">p</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'a')">a</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'img')">img</li>
        </ul>
        <h3>見出し</h3>
        <ul>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h1')">h1</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h2')">h2</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h3')">h3</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h4')">h4</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h5')">h5</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'h6')">h6</li>
        </ul>
        <h3>構造</h3>
        <ul>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'ul')">ul</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'ol')">ol</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'li')">li</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'table')">table</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'tr')">tr</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'td')">td</li>
        </ul>
        <h3>フォーム/input</h3>
        <ul>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'form')">form</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'button')">button</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'checkbox')">checkbox</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'color')">color</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'date')">date</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'datetimelocal')">
                date-time-local</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'email')">email</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'file')">file</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'image')">image</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'month')">month</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'number')">number</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'password')">password</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'radio')">radio</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'range')">range</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'reset')">reset</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'search')">search</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'submit')">submit</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'tel')">tel</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'text')">text</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'time')">time</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'url')">url</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'week')">week</li>
        </ul>
        <h3>その他</h3>
        <ul>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'textarea')">textarea</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'select')">select</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'option')">option</li>
            <li draggable="true" :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, 'label')">label</li>
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