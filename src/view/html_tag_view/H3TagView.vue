<template>
    <h3 :style="position_css" @click="onclick_tag" :class="tagclass">{{ text }}</h3>
</template>

<script lang="ts">
import H3TagData from '@/html_tagdata/H3TagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H3TagView extends HTMLTagViewBase {
    text: string
    tagclass: string

    @Watch('text')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: H3TagData = new H3TagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): H3TagData { return this.tagdata as H3TagData }
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