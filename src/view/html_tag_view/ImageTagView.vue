<template>
    <input v-if="label_type == LabelType.None" type="image" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :style="position_css" @click.prevent.stop="onclick_tag" :name="name"
        :value="value" :src="src" :alt="alt" :class="tagclass" :id="tagdata.tagid" :height="height" :width="width"
        :formaciton="formaciton" :formenctype="formenctype" :formmethod="formmethod" :formnovalidate="formnovalidate"
        :formtarget="formtarget">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        <input type="image" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :src="src" :alt="alt"
            :class="tagclass" :id="tagdata.tagid" :height="height" :width="width" :formaciton="formaciton"
            :formenctype="formenctype" :formmethod="formmethod" :formnovalidate="formnovalidate"
            :formtarget="formtarget">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="image" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :src="src" :alt="alt"
            :class="tagclass" :id="tagdata.tagid" :height="height" :width="width" :formaciton="formaciton"
            :formenctype="formenctype" :formmethod="formmethod" :formnovalidate="formnovalidate"
            :formtarget="formtarget">
    </label>
</template>

<script lang="ts">
import ImageTagData from '@/html_tagdata/ImageTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class TagView extends HTMLTagViewBase {
    LabelType = LabelType
    name: string
    value: string
    src: string
    alt: string
    height: string
    width: string
    formaciton: string
    formenctype: string
    formmethod: string
    formnovalidate: boolean
    formtarget: string
    tagclass: string
    label_type: LabelType
    label: string

    @Watch('name')
    @Watch('value')
    @Watch('src')
    @Watch('alt')
    @Watch('height')
    @Watch('width')
    @Watch('formaction')
    @Watch('formenctype')
    @Watch('formmethod')
    @Watch('formnovalidate')
    @Watch('formtarget')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: ImageTagData = new ImageTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.src = this.src
        tagdata.alt = this.alt
        tagdata.height = this.height
        tagdata.width = this.width
        tagdata.formaciton = this.formaciton
        tagdata.formenctype = this.formenctype
        tagdata.formnovalidate = this.formnovalidate
        tagdata.formtarget = this.formtarget
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): ImageTagData { return this.tagdata as ImageTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.src = this.tagdata_typed.src
        this.alt = this.tagdata_typed.alt
        this.height = this.tagdata_typed.height
        this.width = this.tagdata_typed.width
        this.formaciton = this.tagdata_typed.formaciton
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