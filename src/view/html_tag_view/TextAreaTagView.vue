<template>
    <textarea :style="position_css" readonly @click.prevent.stop="onclick_tag" :autofocus="autofocus" :cols="cols" :disabled="disabled"
        :form="form" :maxlength="maxlength" :name="name" :placeholder="placeholder" :class="tagclass" :id="tagdata.tagid"
        :required="required" :rows="rows" :wrap="wrap"></textarea>
</template>

<script lang="ts">
import TextAreaTagData from '@/html_tagdata/TextAreaTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class TextAreaTagView extends HTMLTagViewBase {
    autofocus: boolean
    cols: string
    disabled: boolean
    form: string
    maxlength: string
    name: string
    placeholder: string
    readonly: boolean
    required: boolean
    rows: string
    wrap: string
    tagclass: string

    @Watch('autofoucs')
    @Watch('cols')
    @Watch('disabled')
    @Watch('form')
    @Watch('maxlength')
    @Watch('name')
    @Watch('placeholder')
    @Watch('deadonly')
    @Watch('required')
    @Watch('rows')
    @Watch('wrap')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: TextAreaTagData = new TextAreaTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.autofocus = this.autofocus
        tagdata.cols = this.cols
        tagdata.disabled = this.disabled
        tagdata.form = this.form
        tagdata.maxlength = this.maxlength
        tagdata.name = this.name
        tagdata.placeholder = this.placeholder
        tagdata.readonly = this.readonly
        tagdata.required = this.required
        tagdata.rows = this.rows
        tagdata.wrap = this.wrap
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): TextAreaTagData { return this.tagdata as TextAreaTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.autofocus = this.tagdata_typed.autofocus
        this.cols = this.tagdata_typed.cols
        this.disabled = this.tagdata_typed.disabled
        this.form = this.tagdata_typed.form
        this.maxlength = this.tagdata_typed.maxlength
        this.name = this.tagdata_typed.name
        this.placeholder = this.tagdata_typed.placeholder
        this.readonly = this.tagdata_typed.readonly
        this.required = this.tagdata_typed.required
        this.rows = this.tagdata_typed.rows
        this.wrap = this.tagdata_typed.wrap
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>