<template>
    <input type="button" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
        :style="position_css" @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid" :name="name"
        :value="value">
</template>

<script lang="ts">
import ButtonTagData from '@/html_tagdata/ButtonTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ButtonTagView extends HTMLTagViewBase {
    name: string
    value: string
    tagclass: string

    @Watch('name')
    @Watch('value')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: ButtonTagData = new ButtonTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): ButtonTagData { return this.tagdata as ButtonTagData }

    @Watch('tagdata')
    update_view() {
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>