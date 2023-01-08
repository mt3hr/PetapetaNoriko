<template>
    <div dropzone="true" @drop.stop="drop" @dragover.prevent="dragover">
        <h2>構造</h2>
        <div class="struct_view">
            <ul class="dropzone_wrap">
                <HTMLTagStructViewLi v-for="tagdata, index in html_tagdatas" :key="index" @onclick_tag="onclick_tag"
                    @copy_tag="copy_tag" @delete_tagdata="delete_tag" :tagdata="tagdata"
                    :html_tagdatas_root="html_tagdatas" @updated_html_tagdatas="updated_html_tagdatas" />
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import HTMLTagStructViewLi from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';

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
                    if (e.shiftKey) {
                        tagdatas.splice(i, 0, move_tagdata)
                    } else if (e.ctrlKey) {
                        tagdatas.splice(i + 1, 0, move_tagdata)
                    } else {
                        tagdatas.splice(i + 1, 0, move_tagdata)
                    }
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

        if (e.shiftKey) {
            html_tagdatas.unshift(move_tagdata)
        } else if (e.ctrlKey) {
            html_tagdatas.push(move_tagdata)
        } else {
            html_tagdatas.push(move_tagdata)
        }

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

    delete_tag(tagdata: HTMLTagDataBase) {
        this.$emit("delete_tagdata", tagdata)
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}

.dropzone_wrap {
    margin-bottom: 20px;
}

.struct_view {
    width: fit-content;
}
</style>