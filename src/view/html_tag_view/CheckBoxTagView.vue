<template>
    <input v-if="label_type == LabelType.None" type="checkbox" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :style="position_css" @click.prevent.stop="onclick_tag" :name="name"
        :value="value" :checked="checked" :class="tagclass" :id="tagdata.tagid">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        {{ label }}
        <input type="checkbox" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :checked="checked"
            :class="tagclass" :id="tagdata.tagid">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="checkbox" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :checked="checked"
            :class="tagclass" :id="tagdata.tagid">
        {{ label }}
    </label>
</template>

<script lang="ts">
import CheckBoxTagData from '@/html_tagdata/CheckBoxTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class CHeckBoxTagView extends HTMLTagViewBase {
    LabelType = LabelType
    name: string
    value: string
    checked: boolean
    tagclass: string
    label_type = LabelType.None
    label = ""

    @Watch('name')
    @Watch('value')
    @Watch('checked')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: CheckBoxTagData = new CheckBoxTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.checked = this.checked
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): CheckBoxTagData { return this.tagdata as CheckBoxTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.checked = this.tagdata_typed.checked
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