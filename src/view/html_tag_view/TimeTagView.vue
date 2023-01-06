<template>
    <input type="time" readonly :style="position_css" @click.prevent.stop="onclick_tag" :name="name" :value="value"
        :autocomplete="autocomplete" :list="list" :max="max" :min="min" :required="required" :class="tagclass" :id="tagdata.tagid"
        :step="step">
</template>

<script lang="ts">
import TimeTagData from '@/html_tagdata/TimeTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class TimeTagView extends HTMLTagViewBase {
    name: string
    value: string
    autocomplete: string
    list: string
    max: string
    min: string
    required: boolean
    step: string
    tagclass: string

    @Watch('name')
    @Watch('value')
    @Watch('autocomplete')
    @Watch('list')
    @Watch('max')
    @Watch('min')
    @Watch('required')
    @Watch('step')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: TimeTagData = new TimeTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.autocomplete = this.autocomplete
        tagdata.list = this.list
        tagdata.max = this.max
        tagdata.min = this.min
        tagdata.required = this.required
        tagdata.step = this.step
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TimeTagData { return this.tagdata as TimeTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.autocomplete = this.tagdata_typed.autocomplete
        this.list = this.tagdata_typed.list
        this.max = this.tagdata_typed.max
        this.min = this.tagdata_typed.min
        this.required = this.tagdata_typed.required
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