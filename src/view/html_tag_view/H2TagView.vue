<template>
    <h2 :style="position_css" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover"
        @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid">{{ text }}</h2>
</template>

<script lang="ts">
import H2TagData from '@/html_tagdata/H2TagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H2TagView extends HTMLTagViewBase {
    text: string
    tagclass: string

    @Watch('text')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: H2TagData = new H2TagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): H2TagData { return this.tagdata as H2TagData }
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