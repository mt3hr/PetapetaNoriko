<template>
    <li v-for="tagdata, index in html_tagdatas" :key="index" draggable="true" dropzone
        @drop.stop="(e) => drop(e, tagdata, true)" @dragstart.stop="(e) => dragstart(e, tagdata, index)"
        @click.stop="() => onclick_tag(tagdata)" @dragover.prevent="dragover">
        <span>{{ tagdata.tagname }}:</span>
        <span>({{ tagdata.to_string() }})</span>
        <ul v-if="tagdata.child_tagdatas.length != 0">
            <HTMLTagStructViewLi :html_tagdatas_root="html_tagdatas_root" :html_tagdatas="tagdata.child_tagdatas"
                @onclick_tag="onclick_tag"
                @updated_html_tagdatas="(tagdatas) => updated_html_tagdatas_child(tagdatas, index)" />
        </ul>
    </li>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import HTMLTagStructViewLi_ref from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';

@Options({
    components: {
        HTMLTagStructViewLi_ref,
    }
})

export default class HTMLTagPropertyView extends Vue {
    @Prop() html_tagdatas_root: Array<HTMLTagDataBase>
    @Prop() html_tagdatas: Array<HTMLTagDataBase>

    dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/struct_li_id")) {
            e.dataTransfer.dropEffect = "move"
        }
    }
    drop(e: DragEvent, tagdata: HTMLTagDataBase, to_child: boolean) {
        if (e.dataTransfer.getData("ppmk/struct_li_id") == tagdata.tagid) {
            return
        }
        let html_tagdatas: Array<HTMLTagDataBase>
        let html_tagdatas_root: Array<HTMLTagDataBase>
        let move_tagdata: HTMLTagDataBase

        let json = JSON.stringify(this.html_tagdatas)
        html_tagdatas = JSON.parse(json, deserialize)
        json = JSON.stringify(this.html_tagdatas_root)
        html_tagdatas_root = JSON.parse(json, deserialize)

        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                if (e.dataTransfer.getData("ppmk/struct_li_id") == tagdatas[i].tagid) {
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

        let is_child = false
        let child_appended = false

        if (to_child) {
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag) {
                            move_tagdata.position_style = PositionStyle.None
                            tagdatas[i].child_tagdatas.push(move_tagdata)
                            child_appended = true
                            return true
                        }
                    }
                    is_child = true
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
        }
        if (!child_appended) {
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata.tagid == tagdatas[i].tagid) {
                        if (!is_child) {
                            move_tagdata.position_style = PositionStyle.Absolute
                        } else {
                            move_tagdata.position_style = PositionStyle.None
                        }
                        tagdatas.splice(i, 0, move_tagdata)
                        return true
                    }
                    is_child = true
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
        }
        this.updated_html_tagdatas(html_tagdatas_root)
    }

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas)
    }

    updated_html_tagdatas_child(tagdatas: any, index: number) {
        this.$emit("updated_html_tagdatas", tagdatas)
    }

    dragstart(e: DragEvent, tagdata: HTMLTagDataBase, index: number): void {
        e.dataTransfer.setData("ppmk/struct_li_id", tagdata.tagid)
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagStructViewLi = HTMLTagStructViewLi_ref
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit('onclick_tag', tagdata)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}
</style>