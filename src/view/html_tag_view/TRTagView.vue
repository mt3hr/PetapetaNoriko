<template>
    <tr :style="position_css" dropzone="true" @dragover="on_dragover" @click.prevent.stop="onclick_tag(tagdata)"
        :class="tagclass" :id="tagdata.tagid" @drop="(e) => on_drop(e, tagdata)" @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :clicked_tagdata="clicked_tagdata" @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border"
            :tagdatas_root="tagdatas_root" @copy_tag="copy_tag" :tagdata="child_tagdata"
            @updated_tagdata="updated_child_tagdata" @onclick_tag="onclick_tag"
            @delete_tagdata="delete_child_tagdata" />
    </tr>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import TRTagData from '@/html_tagdata/TRTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
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
}

</script>
<style scoped>
tr {
    min-width: 30px;
    min-height: 30px;
}
</style>
