<template>
    <input v-if="label_type == LabelType.None" type="color" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
        :style="position_css" @click.prevent.stop="onclick_tag" :name="name" :value="value" :class="tagclass"
        :id="tagdata.tagid" :autocomplete="autocomplete">
    <label :style="position_css" v-else-if="label_type==LabelType.Before">
        {{ label }}
        <input type="color" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :class="tagclass"
            :id="tagdata.tagid" :autocomplete="autocomplete">
    </label>
    <label :style="position_css" v-else-if="label_type==LabelType.After">
        <input type="color" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :name="name" :value="value" :class="tagclass"
            :id="tagdata.tagid" :autocomplete="autocomplete">
        {{ label }}
    </label>
</template>

<script lang="ts">
import ColorTagData from '@/html_tagdata/ColorTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ColorTagView extends HTMLTagViewBase {
    LabelType = LabelType
    name: string
    value: string
    autocomplete: string
    tagclass: string
    label_type: LabelType
    label: string

    @Watch('name')
    @Watch('value')
    @Watch('autocomplete')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: ColorTagData = new ColorTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.autocomplete = this.autocomplete
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): ColorTagData { return this.tagdata as ColorTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
        this.autocomplete = this.tagdata_typed.autocomplete
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