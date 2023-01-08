<template>
    <tr :style="position_css" @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid" @drop="on_drop"
        @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border" :tagdatas_root="tagdatas_root"
            @copy_tag="copy_tag" :tagdata="child_tagdata" @updated_tagdata="updated_child_tagdata"
            @onclick_tag="onclick_child_tag" @delete_tagdata="delete_child_tagdata" />
    </tr>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import TRTagData from '@/html_tagdata/TRTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';
import HTMLTagView from '@/view/HTMLTagView.vue';
import { generate_tagdata_by_tagname } from './generate_tagdata_by_tagname';
import IMGTagData from '@/html_tagdata/IMGTagData';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class TRTagView extends HTMLTagViewBase {
    tagclass: string

    @Watch('tagclass')
    update_tagdata() {
        let tagdata: TRTagData = new TRTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TRTagData { return this.tagdata as TRTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
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
        let tagdata_typed: TRTagData = JSON.parse(json, deserialize)
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
        let tagdata_typed: TRTagData = JSON.parse(json, deserialize)
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
            let tagdata_typed: TRTagData = JSON.parse(json, deserialize)
            let tagname = e.dataTransfer.getData("ppmk/htmltag")
            let tagdata: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)
            tagdata.position_style = PositionStyle.None
            tagdata.position_x = undefined
            tagdata.position_y = undefined
            tagdata_typed.child_tagdatas.push(tagdata)
            this.$emit('updated_tagdata', tagdata_typed)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            if (!this.can_drop(e.dataTransfer.getData("ppmk/move_tag_id"), this.tagdata_typed)) {
                return
            }
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
                            move_tagdata.position_x = undefined
                            move_tagdata.position_y = undefined
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
            this.$emit("updated_tagdatas_root", html_tagdatas_root)
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                let tagdata_typed = this.tagdata_typed
                let tag_data = new IMGTagData()
                tag_data.position_style = PositionStyle.None
                tag_data.src = event.currentTarget.result
                tagdata_typed.child_tagdatas.push(tag_data)
                this.$emit('updated_tagdata', tagdata_typed)
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.stopPropagation()
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagView = HTMLTagView
    }

    updated_tagdatas_root(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_tagdatas_root", tagdatas)
    }
    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }
}

</script>
<style scoped>
tr {
    min-width: 15px;
    min-height: 30px;
}
</style>
