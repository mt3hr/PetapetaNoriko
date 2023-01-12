<template>
    <li :class="tagclass" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" :id="tagdata.tagid"
        :style="position_css" @click.prevent.stop="onclick_tag" :value="value">{{
            text
        }}
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :clicked_tagdata="clicked_tagdata" @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border"
            :tagdatas_root="tagdatas_root" @copy_tag="copy_tag" :tagdata="child_tagdata"
            @updated_tagdata="updated_child_tagdata" @onclick_tag="onclick_child_tag"
            @delete_tagdata="delete_child_tagdata" />
    </li>
</template>

<script lang="ts">
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';
import LITagData from '@/html_tagdata/LITagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import HTMLTagView from '../HTMLTagView.vue';
import HTMLTagViewBase from './HTMLTagViewBase';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class LITagView extends HTMLTagViewBase {
    text: string
    value: string
    tagclass: string

    @Watch('text')
    @Watch('value')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: LITagData = new LITagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.text = this.text
        tagdata.value = this.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): LITagData { return this.tagdata as LITagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.text = this.tagdata_typed.text
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
        let tagdata_typed: LITagData = JSON.parse(json, deserialize)
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
        let tagdata_typed: LITagData = JSON.parse(json, deserialize)
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