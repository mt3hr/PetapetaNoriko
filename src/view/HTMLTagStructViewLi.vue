<template>
    <li v-for="tagdata, index in html_tagdatas" :key="index" draggable="true" dropzone
        @drop.prevent="(e) => drop(e, tagdata, index)" @dragstart.stop="(e) => dragstart(e, tagdata, index)"
        @dragover.prevent="dragover">
        <span>{{ tagdata.tagname }}:</span> <span>({{ tagdata.to_string() }})</span>
        <div v-if="tagdata.child_tags">
            <HTMLTagStructViewLi :tagdatas="tagdata.child_tags"
                @updated_html_tagdatas="(tagdatas) => updated_html_tagdatas_child(tagdatas, index)" />
        </div>
    </li>
</template>
<script lang="ts">
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import HTMLTagStructViewLi from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';

@Options({
    components: {
        HTMLTagStructViewLi,
    }
})

export default class HTMLTagPropertyView extends Vue {
    @Prop() html_tagdatas: Array<HTMLTagDataBase>

    dragover(e: DragEvent) {
        e.dataTransfer.dropEffect = "move"
    }
    drop(e: DragEvent, tagdata: HTMLTagDataBase, index: number) {
        let html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
        let move_tagdata: HTMLTagDataBase
        let removeIndex = -1
        let insertIndex = -1

        let json = JSON.stringify(this.html_tagdatas)
        html_tagdatas = JSON.parse(json, deserialize)

        for (let i = 0; i < html_tagdatas.length; i++) {
            if (e.dataTransfer.getData("ppmk/struct_li_id") == html_tagdatas[i].tagid) {
                move_tagdata = this.html_tagdatas[i]
                removeIndex = i
            }
        }
        html_tagdatas.splice(removeIndex, 1)

        for (let i = 0; i < html_tagdatas.length; i++) {
            if (tagdata.tagid == html_tagdatas[i].tagid) {
                insertIndex = i
            }
        }
        html_tagdatas.splice(insertIndex, 0, move_tagdata)
        this.updated_html_tagdatas(html_tagdatas)
    }

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas)
    }

    updated_html_tagdatas_child(tagdatas: any, index: number) {
        let html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
        let json = JSON.stringify(html_tagdatas)
        html_tagdatas = JSON.parse(json, deserialize)

        let child: HTMLTagDataBase = html_tagdatas[index]
        child.child_tags = tagdatas

        html_tagdatas.splice(index, 0, child)
        this.updated_html_tagdatas(html_tagdatas)
    }

    dragstart(e: DragEvent, tagdata: HTMLTagDataBase, index: number): void {
        e.dataTransfer.setData("ppmk/struct_li_id", tagdata.tagid)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}
</style>