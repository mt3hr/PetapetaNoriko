<template>
    <H1TagView v-if="tagdata.tagname == 'h1'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @updated_tagdata="updated_tagdata" />
    <H2TagView v-if="tagdata.tagname == 'h2'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @updated_tagdata="updated_tagdata" />
    <H3TagView v-if="tagdata.tagname == 'h3'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @updated_tagdata="updated_tagdata" />
    <H4TagView v-if="tagdata.tagname == 'h4'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @updated_tagdata="updated_tagdata" />
    <H5TagView v-if="tagdata.tagname == 'h5'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @updated_tagdata="updated_tagdata" />
    <H6TagView v-if="tagdata.tagname == 'h6'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @updated_tagdata="updated_tagdata" />
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from "vue-property-decorator"
import H1TagView from '@/view/html_tag_view/H1TagView.vue'
import H2TagView from '@/view/html_tag_view/H2TagView.vue'
import H3TagView from '@/view/html_tag_view/H3TagView.vue'
import H4TagView from '@/view/html_tag_view/H4TagView.vue'
import H5TagView from '@/view/html_tag_view/H5TagView.vue'
import H6TagView from '@/view/html_tag_view/H6TagView.vue'
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';

@Options({
    components: {
        H1TagView,
        H2TagView,
        H3TagView,
        H4TagView,
        H5TagView,
        H6TagView,
    }
})
export default class HTMLTagView extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase

    on_drag_start(e: DragEvent) {
        e.dataTransfer.setData("ppmk/move_tag_id", this.tagdata.tagid)
        e.dataTransfer.setData("ppmk/move_tag_offset_x", e.offsetX.toString())
        e.dataTransfer.setData("ppmk/move_tag_offset_y", e.offsetY.toString())
    }

    updated_tagdata(tagdata: HTMLTagDataBase) {
        this.$emit("updated_tagdata", tagdata)
        console.log(tagdata)
    }
}
</script>