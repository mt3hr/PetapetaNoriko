<template>
    <form :style="position_css" dropzone="true" @drop="(e) => on_drop(e, tagdata)" @dragover="on_dragover"
        @click.prevent.stop="onclick_tag(tagdata)" :class="tagclass" :id="tagdata.tagid" :acceptcharset="acceptcharset"
        :action="action" :autocomplete="autocomplete" :enctype="enctype" :method="method" :name="name"
        :novalidate="novalidate" :target="target" @dragover.prevent="on_dragover">
        <HTMLTagView v-for="(child_tagdata, index) in tagdata_typed.child_tagdatas" :key="index"
            :clicked_tagdata="clicked_tagdata" @updated_tagdatas_root="updated_tagdatas_root" :show_border="show_border"
            :tagdatas_root="tagdatas_root" @copy_tag="copy_tag" :tagdata="child_tagdata"
            @updated_tagdata="updated_child_tagdata" @onclick_tag="onclick_tag"
            @delete_tagdata="delete_child_tagdata" />
    </form>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import FormTagData from '@/html_tagdata/FormTagData';
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
export default class FormTagView extends HTMLTagViewBase {
    tagclass: string
    acceptcharset: string
    action: string
    autocomplete: string
    enctype: string
    method: string
    name: string
    novalidate: boolean
    target: string

    @Watch('tagclass')
    @Watch('acceptcharset')
    @Watch('action')
    @Watch('autocomplete')
    @Watch('enctype')
    @Watch('method')
    @Watch('name')
    @Watch('novalidate:')
    @Watch('target')
    update_tagdata() {
        let tagdata: FormTagData = new FormTagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagclass
        tagdata.acceptcharset = this.acceptcharset
        tagdata.action = this.action
        tagdata.autocomplete = this.autocomplete
        tagdata.enctype = this.enctype
        tagdata.method = this.method
        tagdata.name = this.name
        tagdata.novalidate = this.novalidate
        tagdata.target = this.target
        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): FormTagData { return this.tagdata as FormTagData }

    @Watch('tagdata')
    update_view() {
        this.tagclass = this.tagdata_typed.tagclass
        this.acceptcharset = this.tagdata_typed.acceptcharset
        this.action = this.tagdata_typed.action
        this.autocomplete = this.tagdata_typed.autocomplete
        this.enctype = this.tagdata_typed.enctype
        this.method = this.tagdata_typed.method
        this.name = this.tagdata_typed.name
        this.novalidate = this.tagdata_typed.novalidate
        this.target = this.tagdata_typed.target
    }

    created(): void {
        this.update_view()
    }

    updated_child_tagdata(tagdata: HTMLTagDataBase) {
        let json = JSON.stringify(this.tagdata_typed)
        let tagdata_typed: FormTagData = JSON.parse(json, deserialize)
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
        let tagdata_typed: FormTagData = JSON.parse(json, deserialize)
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
}

</script>
<style scoped>
form {
    min-width: 30px;
    min-height: 30px;
}
</style>
