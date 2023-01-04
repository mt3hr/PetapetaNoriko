<template>
    <td :style="position_css" @click.stop="onclick_tag" :class="tagclass" @drop.stop="on_drop" :colspan="colspan"
        :rowspan="rowspan" :headers="headers" @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :show_border="show_border" :tagdatas_root="tagdatas_root" :tagdata="child_tagdata"
            @updated_tagdata="updated_child_tagdata" @onclick_tag="onclick_child_tag(child_tagdata)"
            @delete_tagdata="delete_child_tagdata" />
    </td>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import TDTagData from '@/html_tagdata/TDTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';
import HTMLTagView from '@/view/HTMLTagView.vue';
import { generate_tagdata_by_tagname } from '../DropZone.vue';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class TDTagView extends HTMLTagViewBase {
    tagclass = ""
    colspan: string
    rowspan: string
    headers: string

    @Watch('tagclass')
    @Watch('colspan')
    @Watch('rowspan')
    @Watch('headers')
    update_tagdata() {
        let tagdata: TDTagData = new TDTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.colspan = this.colspan
        tagdata.rowspan = this.rowspan
        tagdata.headers = this.headers
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TDTagData { return this.tagdata as TDTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.colspan = this.tagdata_typed.colspan
        this.rowspan = this.tagdata_typed.rowspan
        this.headers = this.tagdata_typed.headers
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }

    onclick_child_tag(tagdata: HTMLTagDataBase) {
        this.$emit("onclick_tag", tagdata)
    }

    updated_child_tagdata(tagdata: HTMLTagDataBase) {
        let json = JSON.stringify(this.tagdata_typed)
        let tagdata_typed: TDTagData = JSON.parse(json, deserialize)
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                tagdata_typed.child_tagdatas[i] = tagdata
                break
            }
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }

    delete_child_tagdata(html_tagdata: HTMLTagDataBase) {
        let json = JSON.stringify(this.tagdata_typed)
        let tagdata_typed: TDTagData = JSON.parse(json, deserialize)
        let index = -1
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (html_tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                index = i
                break
            }
        }
        if (index != -1) {
            tagdata_typed.child_tagdatas.splice(index, 1)
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }

    on_dragover(e: DragEvent) {
        let tagname = e.dataTransfer.getData("ppmk/htmltag")
        if (tagname) {
            e.dataTransfer.dropEffect = "copy"
        }
    }

    on_drop(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            let json = JSON.stringify(this.tagdata_typed)
            let tagdata_typed: TDTagData = JSON.parse(json, deserialize)
            let tagname = e.dataTransfer.getData("ppmk/htmltag")
            let tagdata: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)
            tagdata.position_style = PositionStyle.None
            tagdata_typed.child_tagdatas.push(tagdata)
            this.$emit('updated_tagdata', tagdata_typed)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            let json = JSON.stringify(this.tagdatas_root)
            let html_tagdatas_root = JSON.parse(json, deserialize)
            let move_tagdata: HTMLTagDataBase

            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (e.dataTransfer.getData("ppmk/move_tag_id") == tagdatas[i].tagid) {
                        move_tagdata = tagdatas[i]
                        tagdatas.splice(i, 1)
                        return true
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            let tagdata_typed = this.tagdata_typed
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata_typed.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag) {
                            move_tagdata.position_style = PositionStyle.None
                            tagdatas[i].child_tagdatas.push(move_tagdata)
                            return true
                        }
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
            this.$emit("update_tagdatas", html_tagdatas_root)
        }
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagView = HTMLTagView
    }
}

</script>
<style scoped>
td {
    min-width: 30px;
    min-height: 30px;
}
</style>
