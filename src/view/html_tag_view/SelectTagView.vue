<template>
    <select :style="position_css" @click.prevent.stop="onclick_tag" :class="tagclass" :id="tagdata.tagid"
        @drop="on_drop" :autofocus="autofocus" :disabled="disabled" :multiple="multiple" :name="name" :size="size"
        @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :clicked_tagdata="clicked_tagdata" @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border" :tagdatas_root="tagdatas_root"
            :tagdata="child_tagdata" @updated_tagdata="updated_child_tagdata"
            @onclick_tag="onclick_child_tag(child_tagdata)" @delete_tagdata="delete_child_tagdata" />
    </select>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import SelectTagData from '@/html_tagdata/SelectTagData';
import { deserialize } from '@/serializable/serializable';
import { Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';
import HTMLTagView from '@/view/HTMLTagView.vue';
import { generate_tagdata_by_tagname } from './generate_tagdata_by_tagname';
import IMGTagData from '@/html_tagdata/IMGTagData';

@Options({
    components: {
        HTMLTagViewBase,
        HTMLTagView,
    }
})
export default class SelectTagView extends HTMLTagViewBase {
    tagclass: string
    autofocus: boolean
    disabled: boolean
    multiple: boolean
    name: string
    size: string

    @Watch('tagclass')
    @Watch('autofocus')
    @Watch('disabled')
    @Watch('multiple')
    @Watch('name')
    @Watch('size')
    update_tagdata() {
        let tagdata: SelectTagData = new SelectTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.autofocus = this.autofocus
        tagdata.disabled = this.disabled
        tagdata.multiple = this.multiple
        tagdata.name = this.name
        tagdata.size = this.size
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): SelectTagData { return this.tagdata as SelectTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.autofocus = this.tagdata_typed.autofocus
        this.disabled = this.tagdata_typed.disabled
        this.multiple = this.tagdata_typed.multiple
        this.name = this.tagdata_typed.name
        this.size = this.tagdata_typed.size
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }

    onclick_child_tag(tagdata: HTMLTagDataBase) {
        this.$emit("onclick_tag", tagdata)
    }

    updated_child_tagdata(tagdata: HTMLTagDataBase) {
        let json = JSON.stringify(this.tagdata_typed)
        let tagdata_typed: SelectTagData = JSON.parse(json, deserialize)
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                tagdata_typed.child_tagdatas[i] = tagdata
                break
            }
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }

    delete_child_tagdata(html_tagdata: HTMLTagDataBase) {
        let json = JSON.stringify(this.tagdata_typed)
        let tagdata_typed: SelectTagData = JSON.parse(json, deserialize)
        let index = -1
        for (let i = 0; i < tagdata_typed.child_tagdatas.length; i++) {
            if (html_tagdata.tagid == tagdata_typed.child_tagdatas[i].tagid) {
                index = i
                break
            }
        }
        if (index != -1) {
            tagdata_typed.child_tagdatas.splice(index, 1)
        }
        this.$emit('updated_tagdata', tagdata_typed)
    }


    beforeCreate(): void {
        (this as any).$options.components.HTMLTagView = HTMLTagView
    }

    updated_tagdatas_root(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_tagdatas_root", tagdatas)
    }
}

</script>
<style scoped>
select {
    min-width: 100px;
    min-height: 25px;
}
</style>