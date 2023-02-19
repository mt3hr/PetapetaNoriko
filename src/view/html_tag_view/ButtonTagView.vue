<template>
    <input v-if="label_type == LabelType.None" type="button" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :style="position_css" @click.prevent.stop="onclick_tag" :class="tagclass"
        :id="tagdata.tagid" :name="name" :value="value">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        {{ label }}
        <input type="button" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid" :name="name"
            :value="value">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="button" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
             @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid" :name="name"
            :value="value">
        {{ label }}
    </label>
</template>

<script lang="ts">
import ButtonTagData from '@/html_tagdata/ButtonTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ButtonTagView extends HTMLTagViewBase {
    LabelType = LabelType
    name: string
    value: string
    tagclass: string
    label_type = LabelType.None
    label = ""

    @Watch('name')
    @Watch('value')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: ButtonTagData = new ButtonTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.name = this.name
        tagdata.value = this.value
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): ButtonTagData { return this.tagdata as ButtonTagData }

    @Watch('tagdata')
    update_view() {
        this.name = this.tagdata_typed.name
        this.value = this.tagdata_typed.value
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