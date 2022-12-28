<template>
    <input type="tel" :style="position_css" @click="onclick_tag" :name="name" :value="value" :size="size"
        :maxlength="maxlength" :autocomplete="autocomplete" :pattern="pattern" :placeholder="placeholder"
        :readonly="readonly" :required="required" :list="list">
</template>

<script lang="ts">
import TelTagData from '@/html_tagdata/TelTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class TagView extends HTMLTagViewBase {
    name: string
    value: string
    size: string
    maxlength: string
    autocomplete: string
    pattern: string
    placeholder: string
    readonly: boolean
    required: boolean
    list: string

    @Watch('name')
    @Watch('value')
    @Watch('size')
    @Watch('maxlength')
    @Watch('autocomplete')
    @Watch('pattern')
    @Watch('placeholder')
    @Watch('readonly')
    @Watch('required')
    @Watch('list')
    update_tagdata() {
        let tagdata: TelTagData = new TelTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagdata.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.size = this.size
        tagdata.maxlength = this.maxlength
        tagdata.autocomplete = this.autocomplete
        tagdata.pattern = this.pattern
        tagdata.placeholder = this.placeholder
        tagdata.readonly = this.readonly
        tagdata.required = this.required
        tagdata.list = this.list
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TelTagData { return this.tagdata as TelTagData }

    @Watch('tagdata')
    update_view() {
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.size = this.tagdata_typed.size
        this.maxlength = this.tagdata_typed.maxlength
        this.autocomplete = this.tagdata_typed.autocomplete
        this.pattern = this.tagdata_typed.pattern
        this.placeholder = this.tagdata_typed.placeholder
        this.readonly = this.tagdata_typed.readonly
        this.required = this.tagdata_typed.required
        this.list = this.tagdata_typed.list
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>