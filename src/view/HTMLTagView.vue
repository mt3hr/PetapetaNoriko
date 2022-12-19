<template>
    <div draggable="true" :ondragstart="on_drag_start">
        <H1TagView v-if="tagdata.tagname == 'h1'" :tagdata="tagdata" />
    </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from "vue-property-decorator"
import H1TagView from '@/view/html_tag_view/H1TagView.vue'
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';

@Options({
    components: {
        H1TagView,
    }
})
export default class HTMLTagView extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    on_drag_start(e: DragEvent) {
        e.dataTransfer.setData("ppmk/move_tag_id", this.tagdata.tagid)
    }
}
</script>