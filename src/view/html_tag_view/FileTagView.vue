<template>
    <input v-if="label_type == LabelType.None" type="file" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :style="position_css" @click.prevent.stop="onclick_tag" :name="name" :value="value"
        :size="size" :class="tagclass" :id="tagdata.tagid" :accept="accept" :multiple="multiple" :required="required">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        {{ label }}
        <input type="file" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
            @click.prevent.stop="onclick_tag" :name="name" :value="value" :size="size" :class="tagclass" :id="tagdata.tagid"
            :accept="accept" :multiple="multiple" :required="required">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="file" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
            @click.prevent.stop="onclick_tag" :name="name" :value="value" :size="size" :class="tagclass" :id="tagdata.tagid"
            :accept="accept" :multiple="multiple" :required="required">
        {{ label }}
    </label>
</template>

<script lang="ts">
import FileTagData from '@/html_tagdata/FileTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class FileTagView extends HTMLTagViewBase {
    LabelType = LabelType
    name: string
    value: string
    size: string
    accept: string
    multiple: boolean
    required: boolean
    tagclass: string
    label_type = LabelType.None
    label = ""

    @Watch('name')
    @Watch('value')
    @Watch('size')
    @Watch('accept')
    @Watch('multiple')
    @Watch('required')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: FileTagData = new FileTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.size = this.size
        tagdata.accept = this.accept
        tagdata.multiple = this.multiple
        tagdata.required = this.required
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): FileTagData { return this.tagdata as FileTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.size = this.tagdata_typed.size
        this.accept = this.tagdata_typed.accept
        this.multiple = this.tagdata_typed.multiple
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