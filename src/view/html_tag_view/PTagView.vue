<template>
    <p :class="tagclass" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" :id="tagdata.tagid"
        :style="position_css" @click.prevent.stop="onclick_tag">{{ text }}</p>
</template>

<script lang="ts">
import PTagData from '@/html_tagdata/PTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class PTagView extends HTMLTagViewBase {
    text: string
    tagclass: string

    @Watch('text')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: PTagData = new PTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): PTagData { return this.tagdata as PTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.text = this.tagdata_typed.text
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>