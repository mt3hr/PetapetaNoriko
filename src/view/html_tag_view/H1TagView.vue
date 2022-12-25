<template>
    <h1 :style="position_css">{{ text }}</h1>
</template>

<script lang="ts">
import H1TagData from '@/html_tagdata/H1TagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H1TagView extends HTMLTagViewBase {
    text: string
    @Watch('text')
    update_tagdata() {
        let tagdata: H1TagData = new H1TagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): H1TagData { return this.tagdata as H1TagData }

    @Watch('tagdata')
    update_view() {
        this.text = this.tagdata_typed.text
    }

    created(): void {
        this.update_view()
    }
}
</script>