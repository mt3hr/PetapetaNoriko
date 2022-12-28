<template>
    <label :style="position_css" @click="onclick_tag" :form="form" :for="this.for" :text="text">{{ text }}</label>
</template>

<script lang="ts">
import LabelTagData from '@/html_tagdata/LabelTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class LabelTagView extends HTMLTagViewBase {
    form: string
    for: string
    text: string

    @Watch('form')
    @Watch('for')
    @Watch('text')
    update_tagdata() {
        let tagdata: LabelTagData = new LabelTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagdata.tagclass
        tagdata.form = this.form
        tagdata.for = this.for
        tagdata.text = this.text
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): LabelTagData { return this.tagdata as LabelTagData }

    @Watch('tagdata')
    update_view() {
        this.form = this.tagdata_typed.form
        this.for = this.tagdata_typed.for
        this.text = this.tagdata_typed.text
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>