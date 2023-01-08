<template>
    <td :style="position_css" @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid" @drop="on_drop"
        :colspan="colspan" :rowspan="rowspan" :headers="headers" @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border" :tagdatas_root="tagdatas_root"
            @copy_tag="copy_tag" :tagdata="child_tagdata" @updated_tagdata="updated_child_tagdata"
            @onclick_tag="onclick_child_tag" @delete_tagdata="delete_child_tagdata" />
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
import { generate_tagdata_by_tagname } from './generate_tagdata_by_tagname';
import IMGTagData from '@/html_tagdata/IMGTagData';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class TDTagView extends HTMLTagViewBase {
    tagclass: string
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
td {
    min-width: 15px;
    min-height: 30px;
}
</style>
