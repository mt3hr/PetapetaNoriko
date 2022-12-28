<template>
    <li :style="position_css" @click="onclick_tag" :value="value">{{ text }}</li>
</template>

<script lang="ts">
import LITagData from '@/html_tagdata/LITagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class TagView extends HTMLTagViewBase {
    text: string
    value: string

    @Watch('text')
    update_tagdata() {
        let tagdata: LITagData = new LITagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagdata.tagclass
        tagdata.text = this.text
        tagdata.value = this.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): LITagData { return this.tagdata as LITagData }

    @Watch('tagdata')
    update_view() {
        this.text = this.tagdata_typed.text
        this.value = this.tagdata_typed.value
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>