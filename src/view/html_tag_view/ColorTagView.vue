
<template>
    <input type="color" :style="position_css" @click="onclick_tag" :name="name" :value="value"
        :autocomplete="autocomplete">
</template>

<script lang="ts">
import ColorTagData from '@/html_tagdata/ColorTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ColorTagView extends HTMLTagViewBase {
    name: string
    value: string
    autocomplete: string

    @Watch('name')
    @Watch('value')
    @Watch('autocomplete')
    update_tagdata() {
        let tagdata: ColorTagData = new ColorTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagdata.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.autocomplete = this.autocomplete
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): ColorTagData { return this.tagdata as ColorTagData }

    @Watch('tagdata')
    update_view() {
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.autocomplete = this.tagdata_typed.autocomplete
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>