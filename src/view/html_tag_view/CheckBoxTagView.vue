<template>
    <input type="checkbox" :style="position_css" @click="onclick_tag" :name="name" :value="value" :checked="checked">
</template>

<script lang="ts">
import CheckBoxTagData from '@/html_tagdata/CheckBoxTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class CHeckBoxTagView extends HTMLTagViewBase {
    name: string
    value: string
    checked: boolean

    @Watch('name')
    @Watch('value')
    @Watch('checked')
    update_tagdata() {
        let tagdata: CheckBoxTagData = new CheckBoxTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagdata.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.checked = this.checked
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): CheckBoxTagData { return this.tagdata as CheckBoxTagData }

    @Watch('tagdata')
    update_view() {
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.checked = this.tagdata_typed.checked
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>