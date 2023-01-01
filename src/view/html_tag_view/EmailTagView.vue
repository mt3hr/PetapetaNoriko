
<template>
    <input type="email" :style="position_css" @click="onclick_tag" :name="name" :value="value" :size="size"
        :class="tagclass" :maxlength="maxlength" :autocomplete="autocomplete" :multiple="multiple" :pattern="pattern"
        :placeholder="placeholder" :readonly="readonly" :required="required">
</template>

<script lang="ts">
import EmailTagData from '@/html_tagdata/EmailTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class EmailTagView extends HTMLTagViewBase {
    name: string
    value: string
    size: string
    maxlength: string
    autocomplete: string
    multiple: boolean
    pattern: string
    placeholder: string
    readonly: boolean
    required: boolean
    tagclass: string

    @Watch('name')
    @Watch('tagclass')
    @Watch('value')
    @Watch('size')
    @Watch('maxlength')
    @Watch('auitocomplete')
    @Watch('multiple')
    @Watch('pattern')
    @Watch('placeholder')
    @Watch('readonly')
    @Watch('required')
    update_tagdata() {
        let tagdata: EmailTagData = new EmailTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.size = this.size
        tagdata.maxlength = this.maxlength
        tagdata.autocomplete = this.autocomplete
        tagdata.multiple = this.multiple
        tagdata.pattern = this.pattern
        tagdata.readonly = this.readonly
        tagdata.required = this.required
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): EmailTagData { return this.tagdata as EmailTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.size = this.tagdata_typed.size
        this.maxlength = this.tagdata_typed.maxlength
        this.autocomplete = this.tagdata_typed.autocomplete
        this.multiple = this.tagdata_typed.multiple
        this.pattern = this.tagdata_typed.pattern
        this.placeholder = this.tagdata_typed.placeholder
        this.readonly = this.tagdata_typed.readonly
        this.required = this.tagdata_typed.required
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>