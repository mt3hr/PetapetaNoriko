<template>
    <table :style="position_css" dropzone="true" @dragover="on_dragover" @click.prevent.stop="onclick_tag"
        :class="tagclass" :id="tagdata.tagid" @drop="(e) => on_drop(e, tagdata)" :disabled="disabled" :label="label"
        :selected="selected" :value="value" @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :clicked_tagdata="clicked_tagdata" @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border"
            :tagdatas_root="tagdatas_root" @copy_tag="copy_tag" :tagdata="child_tagdata"
            @updated_tagdata="updated_child_tagdata" @onclick_tag="onclick_child_tag"
            @delete_tagdata="delete_child_tagdata" />
    </table>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import TableTagData from '@/html_tagdata/TableTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import HTMLTagViewBase from './HTMLTagViewBase';
import HTMLTagView from '@/view/HTMLTagView.vue';
import { generate_tagdata_by_tagname } from './generate_tagdata_by_tagname';
import { Watch } from 'vue-property-decorator';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class TableTagView extends HTMLTagViewBase {
    tagclass: string
    disabled: boolean
    label: string
    selected: boolean
    value: string

    @Watch('tagclass')
    @Watch('disabled')
    @Watch('label')
    @Watch('selected')
    @Watch('value')
    update_tagdata() {
        let tagdata: TableTagData = new TableTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.disabled = this.tagdata_typed.disabled
        tagdata.label = this.tagdata_typed.label
        tagdata.selected = this.tagdata_typed.selected
        tagdata.value = this.tagdata_typed.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TableTagData { return this.tagdata as TableTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.disabled = this.tagdata_typed.disabled
        this.label = this.tagdata_typed.label
        this.selected = this.tagdata_typed.selected
        this.value = this.tagdata_typed.value
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
        let tagdata_typed: TableTagData = JSON.parse(json, deserialize)
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
        let tagdata_typed: TableTagData = JSON.parse(json, deserialize)
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
table {
    min-width: 200px;
    min-height: 25px;
}
</style>
