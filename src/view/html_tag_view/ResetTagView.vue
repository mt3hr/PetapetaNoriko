<template>
    <input type="reset" readonly :class="tagclass" :id="tagdata.tagid" :style="position_css" @click.prevent.stop="onclick_tag" :value="value">
</template>

<script lang="ts">
import ResetTagData from '@/html_tagdata/ResetTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ResetTagView extends HTMLTagViewBase {
    value: string
    tagclass: string

    @Watch('value')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: ResetTagData = new ResetTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.value = this.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): ResetTagData { return this.tagdata as ResetTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
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