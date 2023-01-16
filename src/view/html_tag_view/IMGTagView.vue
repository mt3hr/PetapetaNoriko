<template>
    <img :class="tagclass" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover"
        :id="tagdata.tagid" :style="position_css" @click.prevent.stop="onclick_tag" :src="src" :alt="alt"
        :usemap="usemap" :ismap="ismap" :width="width" :height="height" />
</template>

<script lang="ts">
import IMGTagData from '@/html_tagdata/IMGTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class IMGTagView extends HTMLTagViewBase {
    src: string
    alt: string
    usemap: string
    ismap: string
    width: string
    height: string
    tagclass: string

    @Watch('src')
    @Watch('alt')
    @Watch('usemap')
    @Watch('ismap')
    @Watch('width')
    @Watch('height')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: IMGTagData = new IMGTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.src = this.src
        tagdata.alt = this.alt
        tagdata.usemap = this.usemap
        tagdata.ismap = this.ismap
        tagdata.width = this.width
        tagdata.height = this.height
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): IMGTagData { return this.tagdata as IMGTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.src = this.tagdata_typed.src
        this.alt = this.tagdata_typed.alt
        this.usemap = this.tagdata_typed.usemap
        this.ismap = this.tagdata_typed.ismap
        this.width = this.tagdata_typed.width
        this.height = this.tagdata_typed.height
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>