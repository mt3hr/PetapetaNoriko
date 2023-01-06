<template>
    <li :class="tagclass" :id="tagdata.tagid" :style="position_css" @click.prevent.stop="onclick_tag" :value="value">{{ text }}</li>
</template>

<script lang="ts">
import LITagData from '@/html_tagdata/LITagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

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
}
</script>