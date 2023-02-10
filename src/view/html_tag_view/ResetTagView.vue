<template>
    <input v-if="label_type == LabelType.None" type="reset" dropzone="true" @drop="(e) => on_drop(e, tagdata)"
        @dragover="on_dragover" readonly :class="tagclass" :id="tagdata.tagid" :style="position_css"
        @click.prevent.stop="onclick_tag" :value="value">
    <label :style="position_css" v-else-if="label_type == LabelType.Before">
        <input type="reset" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
            :class="tagclass" :id="tagdata.tagid"  @click.prevent.stop="onclick_tag"
            :value="value">
    </label>
    <label :style="position_css" v-else-if="label_type == LabelType.After">
        <input type="reset" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover" readonly
            :class="tagclass" :id="tagdata.tagid"  @click.prevent.stop="onclick_tag"
            :value="value">
    </label>
</template>

<script lang="ts">
import ResetTagData from '@/html_tagdata/ResetTagData';
import { LabelType } from '@/html_tagdata/LabelType';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ResetTagView extends HTMLTagViewBase {
    LabelType = LabelType
    value: string
    tagclass: string
    label_type: LabelType
    label: string

    @Watch('value')
    @Watch('tagclass')
    @Watch('label')
    @Watch('label_type')
    update_tagdata() {
        let tagdata: ResetTagData = new ResetTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.value = this.value
        tagdata.label_type = this.label_type
        tagdata.label = this.label
        this.$emit("updated_tagdata", tagdata)
    }

    override get tagdata_typed(): ResetTagData { return this.tagdata as ResetTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
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