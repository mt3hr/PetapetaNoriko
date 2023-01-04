<template>
    <h6 :style="position_css" @click.stop="onclick_tag" :class="tagclass">{{ text }}</h6>
</template>

<script lang="ts">
import H6TagData from '@/html_tagdata/H6TagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H6TagView extends HTMLTagViewBase {
    text: string
    tagclass: string

    @Watch('text')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: H6TagData = new H6TagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): H6TagData { return this.tagdata as H6TagData }
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