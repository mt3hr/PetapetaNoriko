<template>
    <li @contextmenu.prevent="show_contextmenu" @click="clicked_page" @drop.stop="drop" @dragover.prevent="dragover"
        :style="style" draggable="true" @dragstart.stop="on_drag_start">
        {{ pagedata.pagename }}</li>
    <v-menu v-model="is_show_contextmenu" :style="contextmenu_style" v-if="editor_mode">
        <v-list>
            <v-list-item @click="copy_page()">コピーを作成</v-list-item>
            <v-list-item @click="delete_page()">削除</v-list-item>
        </v-list>
    </v-menu>
</template>
<script lang="ts">
import { deserialize } from '@/serializable/serializable';
import generateUUID from '@/uuid';
import { Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import PageData from './PageData';

export default class PageListItem extends Vue {
    @Prop() pagedata: PageData
    @Prop() selected: boolean
    @Prop() editor_mode: boolean
    is_show_contextmenu = false
    x_contextmenu = 0
    y_contextmenu = 0

    get style(): any {
        if (this.selected) {
            return { "font-weight": "bold" }
        } else {
            return {}
        }
    }

    clicked_page() {
        this.$emit('clicked_page', this.pagedata)
    }
    delete_page() {
        this.$emit('delete_page', this.pagedata)
    }
    show_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    get contextmenu_style(): any {
        return {
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }

    copy_page(): void {
        let page_copy = this.pagedata.clone()
        page_copy.pageid = generateUUID()
        page_copy.pagename += "_copy"
        this.$emit("copy_page", page_copy)
    }

    drop(e: DragEvent) {
        this.$emit("move_pagedata", e, this.pagedata.clone())
    }

    dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/move_page_id")) {
            e.dataTransfer.dropEffect = "move"
        } else {
            e.dataTransfer.dropEffect = 'none'
        }
    }

    on_drag_start(e: DragEvent) {
        e.dataTransfer.setData("ppmk/move_page_id", this.pagedata.pageid)
    }
}
</script>
