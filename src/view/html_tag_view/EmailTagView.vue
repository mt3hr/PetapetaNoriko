<template>
    <input v-if="label_type == LabelType.None" type="email" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :style="position_css" @click.prevent.stop="onclick_tag" :name="name"
        :value="value" :size="size" :class="tagclass" :id="tagdata.tagid" :maxlength="maxlength"
        :autocomplete="autocomplete" :multiple="multiple" :pattern="pattern" :placeholder="placeholder"
        :required="required">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        <input type="email" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :size="size"
            :class="tagclass" :id="tagdata.tagid" :maxlength="maxlength" :autocomplete="autocomplete"
            :multiple="multiple" :pattern="pattern" :placeholder="placeholder" :required="required">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="email" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :size="size"
            :class="tagclass" :id="tagdata.tagid" :maxlength="maxlength" :autocomplete="autocomplete"
            :multiple="multiple" :pattern="pattern" :placeholder="placeholder" :required="required">
    </label>
</template>

<script lang="ts">
import EmailTagData from '@/html_tagdata/EmailTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class EmailTagView extends HTMLTagViewBase {
    LabelType = LabelType
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
    label_type: LabelType
    label: string

    @Watch('name')
    @Watch('value')
    @Watch('size')
    @Watch('maxlength')
    @Watch('auitocomplete')
    @Watch('multiple')
    @Watch('pattern')
    @Watch('placeholder')
    @Watch('readonly')
    @Watch('required')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
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
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): EmailTagData { return this.tagdata as EmailTagData }

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
        this.label = this.tagdata_typed.label
        this.label_type = this.tagdata_typed.label_type
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>