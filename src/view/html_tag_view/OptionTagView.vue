<template>
    <option :class="tagclass" :id="tagdata.tagid" :style="position_css" @click.prevent.stop="onclick_tag" :disabled="disabled" :label="label"
        :selected="selected" :value="value" />
</template>

<script lang="ts">
import OptionTagData from '@/html_tagdata/OptionTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class OptionTagView extends HTMLTagViewBase {
    disabled: boolean
    label: string
    selected: boolean
    value: string
    tagclass: string

    @Watch('disabled')
    @Watch('label')
    @Watch('selected')
    @Watch('value')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: OptionTagData = new OptionTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.disabled = this.disabled
        tagdata.label = this.label
        tagdata.selected = this.selected
        tagdata.value = this.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): OptionTagData { return this.tagdata as OptionTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.disabled = this.tagdata_typed.disabled
        this.label = this.tagdata_typed.label
        this.selected = this.tagdata_typed.selected
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