<template>
    <div dropzone="true" @drop.stop="drop" @dragover.prevent="dragover">
        <h2>構造</h2>
        <ul>
            <HTMLTagStructViewLi @onclick_tag="onclick_tag" :html_tagdatas="html_tagdatas" :html_tagdatas_root="html_tagdatas"
                @updated_html_tagdatas="updated_html_tagdatas" />
        </ul>
    </div>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import HTMLTagStructViewLi from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        HTMLTagStructViewLi,
    }
})
export default class HTMLTagPropertyView extends Vue {
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas)
    }

    drop(e: DragEvent) {
        let html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
        let move_tagdata: HTMLTagDataBase

        let json = JSON.stringify(this.html_tagdatas)
        html_tagdatas = JSON.parse(json, deserialize)

        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                if (e.dataTransfer.getData("ppmk/struct_li_id") == tagdatas[i].tagid) {
                    move_tagdata = tagdatas[i]
                    tagdatas.splice(i, 1)
                    return true
                }
                if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                    return true
                }
            }
            return false
        }
        walk_tagdatas(html_tagdatas)

        move_tagdata.position_style = PositionStyle.Absolute
        html_tagdatas.push(move_tagdata)
        this.updated_html_tagdatas(html_tagdatas)
    }

    dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/struct_li_id")) {
            e.dataTransfer.dropEffect = "move"
        }
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit('onclick_tag', tagdata)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}
</style>