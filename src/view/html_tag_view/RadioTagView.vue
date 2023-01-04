<template>
    <input type="radio" readonly :style="position_css" @click.stop="onclick_tag" :name="name" :value="value" :checked="checked"
        :class="tagclass" :required="required" />
</template>

<script lang="ts">
import RadioTagData from '@/html_tagdata/RadioTagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class RadioTagView extends HTMLTagViewBase {
    name: string
    value: string
    checked: boolean
    required: boolean
    tagclass: string

    @Watch('name')
    @Watch('value')
    @Watch('checked')
    @Watch('required')
    @Watch('tagclass')
    update_tagdata() {
        let tagdata: RadioTagData = new RadioTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.checked = this.checked
        tagdata.required = this.required
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): RadioTagData { return this.tagdata as RadioTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.checked = this.tagdata_typed.checked
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