<template>
    <input type="file" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
        :style="position_css" @click.prevent.stop="onclick_tag" :name="name" :value="value" :size="size"
        :class="tagclass" :id="tagdata.tagid" :accept="accept" :multiple="multiple" :required="required">
</template>

<script lang="ts">
import FileTagData from '@/html_tagdata/FileTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class FileTagView extends HTMLTagViewBase {
    name: string
    value: string
    size: string
    accept: string
    multiple: boolean
    required: boolean
    tagclass: string

    @Watch('name')
    @Watch('value')
    @Watch('size')
    @Watch('accept')
    @Watch('multiple')
    @Watch('required')
    @Watch('tagclass')
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
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): FileTagData { return this.tagdata as FileTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.size = this.tagdata_typed.size
        this.accept = this.tagdata_typed.accept
        this.multiple = this.tagdata_typed.multiple
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