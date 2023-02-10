<template>
    <input v-if="label_type == LabelType.None" type="submit" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :style="position_css" @click.prevent.stop="onclick_tag" :name="name"
        :value="value" :formaction="formaction" :class="tagclass" :id="tagdata.tagid" :formenctype="formenctype"
        :formmethod="formmethod" :formnovalidate="formnovalidate" :formtarget="formtarget">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        <input type="submit" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :formaction="formaction"
            :class="tagclass" :id="tagdata.tagid" :formenctype="formenctype" :formmethod="formmethod"
            :formnovalidate="formnovalidate" :formtarget="formtarget">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="submit" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :formaction="formaction"
            :class="tagclass" :id="tagdata.tagid" :formenctype="formenctype" :formmethod="formmethod"
            :formnovalidate="formnovalidate" :formtarget="formtarget">
    </label>
</template>

<script lang="ts">
import SubmitTagData from '@/html_tagdata/SubmitTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class SubmitTagView extends HTMLTagViewBase {
    LabelType = LabelType
    name: string
    value: string
    formaction: string
    formenctype: string
    formmethod: string
    formnovalidate: boolean
    formtarget: string
    tagclass: string
    label_type: LabelType
    label: string

    @Watch('name')
    @Watch('value')
    @Watch('formaction')
    @Watch('formenctype')
    @Watch('formmethod')
    @Watch('formnovalidate')
    @Watch('formtarget')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: SubmitTagData = new SubmitTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.formaction = this.formaction
        tagdata.formenctype = this.formenctype
        tagdata.formmethod = this.formmethod
        tagdata.formnovalidate = this.formnovalidate
        tagdata.formtarget = this.formtarget
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): SubmitTagData { return this.tagdata as SubmitTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.formaction = this.tagdata_typed.formaction
        this.formenctype = this.tagdata_typed.formenctype
        this.formmethod = this.tagdata_typed.formmethod
        this.formnovalidate = this.tagdata_typed.formnovalidate
        this.formtarget = this.tagdata_typed.formtarget
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