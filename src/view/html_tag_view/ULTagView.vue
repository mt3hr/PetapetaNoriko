<template>
    <ul :style="position_css" @click="onclick_tag" :class="tagclass" @drop.stop="on_drop_li_component"
        @dragover.prevent="on_dragover_li_component">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :tagdata="child_tagdata" @updated_tagdata="updated_child_tagdata"
            @onclick_tag="onclick_child_tag(child_tagdata)" @delete_tagdata="delete_child_tagdata" />
    </ul>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import LITagData from '@/html_tagdata/LITagData';
import ULTagData from '@/html_tagdata/ULTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';
import HTMLTagView from '@/view/HTMLTagView.vue';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class TextTagView extends HTMLTagViewBase {
    tagclass = ""

    @Watch('tagclass')
    update_tagdata() {
        let tagdata: ULTagData = new ULTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): ULTagData { return this.tagdata as ULTagData }

    @Watch('tagdata')
    update_view() {
        //TODO
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
        let tagdata_typed: ULTagData = JSON.parse(json, deserialize)
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
        let tagdata_typed: ULTagData = JSON.parse(json, deserialize)
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

    on_dragover_li_component(e: DragEvent) {
        let tagname = e.dataTransfer.getData("ppmk/htmltag")
        if (tagname != "li") {
            e.dataTransfer.dropEffect = "none"
            return
        }
        e.dataTransfer.dropEffect = "copy"
    }

    on_drop_li_component(e: DragEvent) {
        let json = JSON.stringify(this.tagdata_typed)
        let tagdata_typed: ULTagData = JSON.parse(json, deserialize)

        let tagname = e.dataTransfer.getData("ppmk/htmltag")
        if (tagname != "li") {
            return
        }
        let tag_data: LITagData = new LITagData()
        tag_data.position_style = PositionStyle.None
        tagdata_typed.child_tagdatas.push(tag_data)

        this.$emit('updated_tagdata', tagdata_typed)
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagView = HTMLTagView
    }
}

</script>
<style scoped>
ul {
    min-width: 200px;
    min-height: 50px;
    background-color: silver;
}
</style>
