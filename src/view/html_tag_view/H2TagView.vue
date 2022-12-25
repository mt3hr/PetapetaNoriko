<template>
    <h2 :style="position_css">{{ text }}</h2>
</template>

<script lang="ts">
import H2TagData from '@/html_tagdata/H2TagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H2TagView extends HTMLTagViewBase {
    text: string
    @Watch('text')
    update_tagdata() {
        let tagdata: H2TagData = new H2TagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): H2TagData { return this.tagdata as H2TagData }
    @Watch('tagdata')
    update_view() {
        this.text = this.tagdata_typed.text
    }

    created(): void {
        this.update_view()
    }
}
</script>