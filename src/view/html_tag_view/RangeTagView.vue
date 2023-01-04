<template>
    <input type="range" readonly :style="position_css" @click.stop="onclick_tag" :name="name" :value="value" :class="tagclass"
        :autocomplete="autocomplete" :list="list" :max="max" :min="min" :step="step">
</template>

<script lang="ts">
import RangeTagData from '@/html_tagdata/RangeTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class RangeTagView extends HTMLTagViewBase {
    name: string
    value: string
    autocomplete: string
    list: string
    max: string
    min: string
    step: string
    tagclass: string

    @Watch('name')
    @Watch('value')
    @Watch('autocomplete')
    @Watch('list')
    @Watch('max')
    @Watch('min')
    @Watch('step')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: RangeTagData = new RangeTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.autocomplete = this.autocomplete
        tagdata.list = this.list
        tagdata.max = this.max
        tagdata.min = this.min
        tagdata.step = this.step
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): RangeTagData { return this.tagdata as RangeTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.autocomplete = this.tagdata_typed.autocomplete
        this.list = this.tagdata_typed.list
        this.max = this.tagdata_typed.max
        this.min = this.tagdata_typed.min
        this.step = this.tagdata_typed.step
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>