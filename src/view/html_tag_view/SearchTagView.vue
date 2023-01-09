<template>
    <input type="search" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
        :style="position_css" @click.prevent.stop="onclick_tag" :name="name" :value="value" :size="size"
        :maxlength="maxlength" :autocomplete="autocomplete" :pattern="pattern" :placeholder="placeholder"
        :class="tagclass" :id="tagdata.tagid" :required="required" :list="list">
</template>

<script lang="ts">
import SearchTagData from '@/html_tagdata/SearchTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class SearchTagView extends HTMLTagViewBase {
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
    tagclass: string

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
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: SearchTagData = new SearchTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
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

    get tagdata_typed(): SearchTagData { return this.tagdata as SearchTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
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