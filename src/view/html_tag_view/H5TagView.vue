<template>
    <h5 :style="position_css">{{ text }}</h5>
</template>

<script lang="ts">
import H5TagData from '@/html_tagdata/H5TagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H5TagView extends HTMLTagViewBase {
    text: string
    @Watch('text')
    update_tagdata() {
        let tagdata: H5TagData = new H5TagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): H5TagData { return this.tagdata as H5TagData }
    @Watch('tagdata')
    update_view() {
        this.text = this.tagdata_typed.text
    }

    created(): void {
        this.update_view()
    }
}
</script>